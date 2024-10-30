import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function ansiToHtml(text: string): string {
  // Map ANSI color codes to HTML CSS styles
  const ansiStyles: { [key: string]: string } = {
    '30': 'color: black;',
    '31': 'color: red;',
    '32': 'color: green;',
    '33': 'color: yellow;',
    '34': 'color: blue;',
    '35': 'color: magenta;',
    '36': 'color: cyan;',
    '37': 'color: white;',
    '90': 'color: gray;', // Bright black
    '1': 'font-weight: bold;',
    '2': 'opacity: 0.8;', // dim
    '22': 'font-weight: normal;', // reset bold/dim
    '39': 'color: initial;', // reset color
  };

  // Replace ANSI codes with HTML span elements
  let result = text.replace(/\u001b\[(\d{1,2})m/g, (match, code) => {
    const style = ansiStyles[code] || '';
    return style ? `<span style="${style}">` : '</span>';
  });

  // Ensure we close any open span tags
  const openTags = (text.match(/\u001b\[\d{1,2}m/g) || []).length;
  result += '</span>'.repeat(openTags);

  return result;
}