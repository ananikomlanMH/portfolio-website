const fs = require('node:fs');
const path = require('node:path');
const CleanCSS = require('clean-css');

const directory = path.join(__dirname, '..', 'assets', 'css');
const files = [
    ['vendors.min.css', 'vendors.optimized.min.css'],
    ['icon.min.css', 'icon.optimized.min.css'],
    ['responsive.css', 'responsive.min.css'],
    ['style.css', 'style.min.css'],
    ['portfolio.css', 'portfolio.min.css'],
    ['onepage.css', 'onepage.min.css'],
    ['theme.css', 'theme.min.css']
];

for (const [source, destination] of files) {
    const input = fs.readFileSync(path.join(directory, source), 'utf8');
    // Keep relative URLs, remote imports and rule order; preserve license comments.
    const result = new CleanCSS({ level: 1, rebase: false, inline: ['none'] }).minify(input);
    if (result.errors.length) throw new Error(result.errors.join('\n'));
    for (const warning of result.warnings) console.warn(warning);
    fs.writeFileSync(path.join(directory, destination), result.styles + '\n');
    console.log(`${source}: ${Buffer.byteLength(input)} -> ${Buffer.byteLength(result.styles)} bytes`);
}
