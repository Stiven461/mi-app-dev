const API_URL = 'http://localhost:3000/api/tasks';

let currentFilter = 'all';
let tasks = [];

// Cargar tareas al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    document.getElementById('addBtn').addEventListener('click', addTask);
    document.getElementById('taskInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    // Filtros
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });
});

async function loadTasks() {
    try {
        const response = await fetch(API_URL);
        tasks = await response.json();
        renderTasks();
        updateStats();
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

async function addTask() {
    const input = document.getElementById('taskInput');
    const title = input.value.trim();

    if (!title) return;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });

        const newTask = await response.json();
        tasks.unshift(newTask);
        renderTasks();
        updateStats();
        input.value = '';
    } catch (error) {
        console.error('Error adding task:', error);
    }
}

async function toggleTask(id, completed) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: completed ? 0 : 1 })
        });

        const task = tasks.find(t => t.id === id);
        if (task) task.completed = task.completed ? 0 : 1;
        renderTasks();
        updateStats();
    } catch (error) {
        console.error('Error toggling task:', error);
    }
}

async function deleteTask(id) {
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();
        updateStats();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    let filteredTasks = tasks;

    if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(t => t.completed === 0);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(t => t.completed === 1);
    }

    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<div style="text-align:center; padding:20px; color:#999;">No hay tareas</div>';
        return;
    }

    taskList.innerHTML = filteredTasks.map(task => `
        <li class="task-item">
            <input type="checkbox" class="task-checkbox"
                   ${task.completed ? 'checked' : ''}
                   onchange="toggleTask(${task.id}, ${task.completed})">
            <span class="task-title ${task.completed ? 'completed' : ''}">${escapeHtml(task.title)}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">🗑️</button>
        </li>
    `).join('');
}

function updateStats() {
    document.getElementById('totalTasks').textContent = tasks.length;
    document.getElementById('pendingTasks').textContent = tasks.filter(t => t.completed === 0).length;
    document.getElementById('completedTasks').textContent = tasks.filter(t => t.completed === 1).length;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
