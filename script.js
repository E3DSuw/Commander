let tasks = {};
let islands = {};
let currentBucket = null;
let currentIsland = null;
const taskListElement = document.getElementById('task-list');
const currentBucketDisplayElement = document.getElementById('current-bucket-display');
const newTaskInput = document.getElementById('new-task-input');
const newBucketInput = document.getElementById('new-bucket-input');

async function loadTasks() {
  try {
    const response = await fetch('slash.txt');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    tasks = {};
    islands = {};
    currentBucket = null;
    currentIsland = null;

    if (!text.trim()) {
      renderTasks();
      updateCurrentBucketDisplay();
      return;
    }

    const lines = text.split('\n');
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.endsWith('>')) {
        currentBucket = trimmedLine.slice(0, -1).trim();
        tasks[currentBucket] = {};
        currentIsland = null;
      } else if (trimmedLine.endsWith('<')) {
        currentBucket = null;
      } else if (trimmedLine.endsWith('}')) {
        const islandName = trimmedLine.slice(0, -1).trim();
        islands[islandName] = {};
        currentIsland = islandName;
      } else if (trimmedLine.endsWith('{')) {
        currentIsland = null;
      } else if (currentBucket) {
        const lineTasks = trimmedLine.split(';');
        for (const task of lineTasks) {
          const trimmedTask = task.trim();
          if (trimmedTask) {
            tasks[currentBucket][trimmedTask] = {};
          }
        }
      } else if (currentIsland) {
        const lineTasks = trimmedLine.split(';');
        for (const task of lineTasks) {
          const trimmedTask = task.trim();
          if (trimmedTask) {
            if (!islands[currentIsland]) {
              islands[currentIsland] = {};
            }
            islands[currentIsland][trimmedTask] = {};
          }
        }
      }
    }
    renderTasks();
    updateCurrentBucketDisplay();
  } catch (error) {
    console.error('Error loading tasks:', error);
    alert('Error loading task file. Please check the console for details.');
  }
}

function saveTasks() {
  let text = '';
  for (const bucket in tasks) {
    text += bucket + ' >\n';
    text += Object.keys(tasks[bucket]).join('; ') + '\n<\n';
  }

  for (const island in islands) {
    text += island + ' }\n';
    text += Object.keys(islands[island]).join('; ') + '\n{\n';
  }

  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'slash.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function renderTasks() {
  const fragment = document.createDocumentFragment();
  for (const bucket in tasks) {
    const bucketLi = document.createElement('li');
    bucketLi.textContent = bucket + ':';
    bucketLi.classList.add('bucket');
    bucketLi.addEventListener('click', () => {
      currentBucket = bucket;
      updateCurrentBucketDisplay();
    });
    const subUl = document.createElement('ul');
    for (const task in tasks[bucket]) {
      const taskLi = document.createElement('li');
      taskLi.textContent = task;
      subUl.appendChild(taskLi);
    }
    bucketLi.appendChild(subUl);
    fragment.appendChild(bucketLi);
  }

  for (const island in islands) {
    const islandLi = document.createElement('li');
    islandLi.textContent = island + ' (Island):';
    islandLi.classList.add('island');
    const subUl = document.createElement('ul');
    for (const task in islands[island]) {
      const taskLi = document.createElement('li');
      taskLi.textContent = task;
      subUl.appendChild(taskLi);
    }
    islandLi.appendChild(subUl);
    fragment.appendChild(islandLi);
  }

  taskListElement.innerHTML = '';
  taskListElement.appendChild(fragment);
}

function updateCurrentBucketDisplay() {
  currentBucketDisplayElement.textContent = `Current Bucket: ${currentBucket || 'None'}`;
}

document.getElementById('add-task-button').addEventListener('click', () => {
  const taskName = newTaskInput.value.trim();
  if (taskName && currentBucket) {
    tasks[currentBucket][taskName] = {};
    renderTasks();
    newTaskInput.value = '';
  } else if (!currentBucket) {
    alert('Please select a bucket before adding a task.');
  }
});

document.getElementById('add-bucket-button').addEventListener('click', () => {
  const bucketName = newBucketInput.value.trim();
  if (bucketName) {
    tasks[bucketName]
