// Importing required modules
const { Octokit } = require("@octokit/rest");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");

// Check if GitHub token, owner, and repo are provided as command line arguments
const [token, owner, repo] = process.argv.slice(2);

if (!token || !owner || !repo) {
    console.error("Usage: node downloadArtifacts.js <GITHUB_TOKEN> <OWNER> <REPO>");
    process.exit(1);
}

// Set up Octokit (GitHub API client) with the provided token
const octokit = new Octokit({ auth: token });

async function downloadArtifacts() {
    const downloadedBranches = []; // To store names of all downloaded branches

    try {
        // Get all workflow runs for the repository
        const runs = await octokit.actions.listWorkflowRunsForRepo({
            owner,
            repo,
        });

        // Group workflow runs by branch
        const branchRuns = {};
        for (const run of runs.data.workflow_runs) {
            const branch = run.head_branch;
            // If this is the first workflow run we've seen for the branch, or it's more recent, update the branchRuns
            if (!branchRuns[branch] || new Date(run.created_at) > new Date(branchRuns[branch].created_at)) {
                branchRuns[branch] = run;
            }
        }

        // Iterate through the most recent workflow run for each branch
        for (const branch in branchRuns) {
            const run = branchRuns[branch];

            // Get the list of artifacts for the most recent workflow run of the branch
            const artifacts = await octokit.actions.listWorkflowRunArtifacts({
                owner,
                repo,
                run_id: run.id,
            });

            // Download only the 'test-results' artifact
            for (const artifact of artifacts.data.artifacts) {
                if (artifact.name === 'test-results') {
                    const downloadUrl = await octokit.actions.downloadArtifact({
                        owner,
                        repo,
                        artifact_id: artifact.id,
                        archive_format: 'zip',
                    });

                    // Download the artifact and save it with the branch name
                    const filePath = path.join(__dirname, `${branch}.zip`);
                    const writer = fs.createWriteStream(filePath);

                    const artifactResponse = await axios({
                        url: downloadUrl.url,
                        method: 'GET',
                        responseType: 'stream',
                    });

                    artifactResponse.data.pipe(writer);

                    // Wait for the download to finish
                    await new Promise((resolve, reject) => {
                        writer.on('finish', async () => {
                            console.log(`Downloaded: ${branch}.zip`);

                            // Create a folder named after the branch and extract the zip
                            const extractDir = path.join(__dirname, branch);
                            fs.mkdirSync(extractDir, { recursive: true });

                            fs.createReadStream(filePath)
                                .pipe(unzipper.Extract({ path: extractDir }))
                                .on('close', () => {
                                    console.log(`Extracted: ${branch}`);
                                    downloadedBranches.push(branch); // Add branch name to the list
                                });

                            resolve();
                        });

                        writer.on('error', (err) => {
                            console.error(`Error downloading ${artifact.name}: ${err.message}`);
                            reject(err);
                        });
                    });
                }
            }
        }

        // After all downloads, write the list of branches to a JSON file
        const jsonFilePath = path.join(__dirname, 'downloaded_branches.json');
        fs.writeFileSync(jsonFilePath, JSON.stringify(downloadedBranches, null, 2));
        console.log(`Branch list written to ${jsonFilePath}`);
    } catch (error) {
        console.error(`Error fetching artifacts: ${error.message}`);
    }
}

// Start the download process
downloadArtifacts();
