(() => {
    const { execSync, exec } = require('child_process');
    const fs = require('fs');
    const examples = fs.readdirSync(__dirname).filter(file => file.endsWith('.js') && file !== 'runall.js');
    for (const file of examples) {
        console.log(`Running ${file}...`);
        const result = execSync(`node ${__dirname}/${file}`, { encoding: 'utf8' });
        console.log(result);
    }
})();