const fs = require('fs');

const taskFile = 'README-TASK.md';
const historyFile = 'README-HISTORYTASK.md';

if (fs.existsSync(taskFile)) {
    let tasks = fs.readFileSync(taskFile, 'utf8');
    let history = fs.existsSync(historyFile) ? fs.readFileSync(historyFile, 'utf8') : '# Historial de Tareas Completadas\n\n';

    const lines = tasks.split('\n');
    const remainingTasks = [];
    const completedTasks = [];

    let currentSection = '';

    for (let line of lines) {
        if (line.trim().startsWith('- [x]')) {
            const date = new Date().toISOString().split('T')[0];
            completedTasks.push(line + ' (Completado: ' + date + ')');
        } else {
            remainingTasks.push(line);
        }
    }

    if (completedTasks.length > 0) {
        fs.writeFileSync(taskFile, remainingTasks.join('\n'));
        fs.writeFileSync(historyFile, history + '\n' + completedTasks.join('\n') + '\n');
        console.log('✅ Tareas completadas movidas al historial.');
    }
}
