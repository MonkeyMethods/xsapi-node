(() => {
    const { execSync } = require('child_process');
    const fs = require('fs');
    const examples = fs.readdirSync(__dirname).filter(file => file.endsWith('.js') && file !== 'runall.js');
    for (const file of examples) {
        console.log(`\x1b[33mRunning ${file}\x1b[0m`);
        const result = execSync(`node ${__dirname}/${file}`, { encoding: 'utf8' });
        console.log(`\n\x1b[32m${result}\x1b[0m\n`);
    }
})();