// Main Function and Initialization
async function main() {
  await loadTasks();
  setupEventListeners();
  renderTasks();
  updateCurrentBucketDisplay();
}

// Data Handling Functions
async function loadTasks() {
  try {
    const text = await fetchTextFile('slash.txt');
    parseTasks(text);
  } catch (error) {
    handleLoadError(error);
  }
}

function fetchTextFile(filename) {
  return fetch(filename).then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.text();
  });
}

function parseTasks(text) {
  tasks = {};
  islands = {};
  currentBucket = null;
  currentIsland = null;

  if (!text.trim()) return;

  const lines = text.split('\n');
  for (const line of lines) {
    processLine(line.trim());
  }
}

function processLine(line) {
  if (line.endsWith('>')) {
    currentBucket = line.slice(0, -1).trim();
    tasks[currentBucket] = {};
    currentIsland = null;
  } else if (line.endsWith('<')) {
    currentBucket = null;
  } else if (line.endsWith('}')) {
    const islandName = line.slice(0, -1).trim();
    islands[islandName] = {};
    currentIsland = islandName;
  } else if (line.endsWith('{')) {
    currentIsland = null;
  } else if (currentBucket) {
    processTasks(line, tasks[currentBucket]);
  } else if (currentIsland) {
    processTasks(line, islands[currentIsland]);
  }
}

function processTasks(line, target) {
  const lineTasks = line.split(';');
  for (const task of lineTasks) {
    const trimmedTask = task.trim();
    if (trimmedTask) {
      target[trimmedTask] = {};
    }
  }
}

function handleLoadError(error) {
  console.error('Error loading tasks:', error);
  alert('Error loading task file. Please check the console for details.');
}

function saveTasks() {
  let text = '';
  for (const bucket in tasks) {
    text += `${bucket} >\n${Object.keys(tasks[bucket]).join('; ')}\n<\n`;
  }
  for (const island in islands) {
    text += `${island} }\n${Object.keys(islands[island]).join('; ')}\n{\n`;
  }
  downloadFile('slash.txt', text);
}

function downloadFile(filename, text) {
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Rendering Functions
function renderTasks() {
  const fragment = document.createDocumentFragment();
  renderBuckets(fragment);
  renderIslands(fragment);
  taskListElement.innerHTML = '';
  taskListElement.appendChild(fragment);
}

function renderBuckets(fragment) {
  for (const bucket in tasks) {
    const bucketLi = createBucketElement(bucket);
    fragment.appendChild(bucketLi);
  }
}

function renderIslands(fragment) {
  for (const island in islands) {
    const islandLi = createIslandElement(island);
    fragment.appendChild(islandLi);
  }
}

function createBucketElement(bucket) {
  const bucketLi = document.createElement('li');
  bucketLi.textContent = bucket + ':';
  bucketLi.classList.add('bucket');
  bucketLi.addEventListener('click', () => {
    currentBucket = bucket;
    updateCurrentBucketDisplay();
  });
  const subUl = document.createElement('ul');
  for (const task in tasks[bucket]) {
    const taskLi = createTaskElement(tasks[bucket], task, bucket);
    subUl.appendChild(taskLi);
  }
  bucketLi.appendChild(createDeleteButton(tasks, bucket));
  bucketLi.appendChild(subUl);
  return bucketLi;
}

function createIslandElement(island) {
  const islandLi = document.createElement('li');
  islandLi.textContent = island + ' (Island):';
  islandLi.classList.add('island');
  const subUl = document.createElement('ul');
  for (const task in islands[island]) {
    const taskLi = createTaskElement(islands[island], task, island);
    subUl.appendChild(taskLi);
  }
  islandLi.appendChild(createDeleteButton(islands, island));
  islandLi.appendChild(subUl);
  return islandLi;
}

function createTaskElement(data, task, parentKey) {
  const taskLi = document.createElement('li');
  taskLi.textContent = task;
  taskLi.appendChild(createDeleteButton(data, task, parentKey));
  return taskLi;
}

function createDeleteButton(data, key, parentKey) {
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'X';
  deleteButton.classList.add('delete-button');
  deleteButton.addEventListener('click', (event) => {
    event.stopPropagation();
    if (key) {
      delete data[key];
    } else {
      delete data[parentKey];
    }
    saveTasks();
    renderTasks();
  });
  return deleteButton;
}

function updateCurrentBucketDisplay() {
  currentBucketDisplayElement.textContent = `Current Bucket: ${currentBucket || 'None'}`;
}

// Event Listeners
function setupEventListeners() {
  document.getElementById('add-task-button').addEventListener('click', addTask);
  document.getElementById('add-bucket-button').addEventListener('click', addBucket);
  document.getElementById('add-island-button').addEventListener('click', addIsland);
  document.getElementById('save-button').addEventListener('click', saveTasks);
}

function addTask() {
  const taskName = newTaskInput.value.trim();
  if (taskName && currentBucket) {
    tasks[currentBucket][taskName] = {};
    saveTasks();
    renderTasks();
    newTaskInput.value = '';
  } else if (!currentBucket) {
    alert('Please select a bucket before adding a task.');
  }
}

function addBucket() {
  const bucketName = newBucketInput.value.trim();
  if (bucketName) {
    tasks[bucketName] = {};
    currentBucket = bucketName;
    saveTasks();
    renderTasks();
    updateCurrentBucketDisplay();
    newBucketInput.value = '';
  }
}

function addIsland() {
  const islandName = newIslandInput.value.trim();
  if (islandName) {
    islands[islandName] = {};
    saveTasks();
    renderTasks();
    newIslandInput.value = '';
  }
}

// Initialization
let tasks = {};
let islands = {};
let currentBucket = null;
let currentIsland = null;
const taskListElement = document.getElementById('task-list');
const currentBucketDisplayElement = document.getElementById('current-bucket-display');
const newTaskInput = document.getElementById('new-task-input');
const newBucketInput = document.getElementById('new-bucket-input');
const newIslandInput = document.getElementById('new-island-input');

main();
