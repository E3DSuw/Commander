let tasks = {};
let currentBucket = null;
const taskListElement = document.getElementById('task-list');
const currentBucketDisplayElement = document.getElementById('current-bucket-display');

async function loadTasks() {
  try {
    const response = await fetch('slash.txt');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    tasks = {};
    currentBucket = null;

    if (text.trim() === "") {
      renderTasks();
      updateCurrentBucketDisplay();
      return;
    }

    text.split('\n').forEach(line => {
      line = line.trim();
      if (line.endsWith('>')) {
        currentBucket = line.slice(0, -1).trim();
        tasks[currentBucket] = {};
      } else if (line.endsWith('<')) {
        currentBucket = null;
      } else if (currentBucket) {
        line.split(';').forEach(task => {
          task = task.trim();
          if (task) {
            tasks[currentBucket][task] = {};
          }
        });
      }
    });
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
    let taskList = [];
    for (const task in tasks[bucket]) {
      taskList.push(task);
    }
    text += taskList.join('; ');
    text += '\n<\n';
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
  const fragment = document.createDocumentFragment(); // Use a document fragment
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
    fragment.appendChild(bucketLi); // Append to fragment
  }
  taskListElement.innerHTML = ''; // Clear once
  taskListElement.appendChild(fragment); // Append fragment once
}

function updateCurrentBucketDisplay() {
  currentBucketDisplayElement.textContent = `Current Bucket: ${currentBucket || 'None'}`;
}

document.getElementById('add-task-button').addEventListener('click', () => {
  const taskName = document.getElementById('new-task-input').value.trim();
  if (taskName && currentBucket) {
    tasks[currentBucket][taskName] = {};
    renderTasks();
    document.getElementById('new-task-input').value = '';
  } else if (!currentBucket) {
    alert('Please select a bucket before adding a task.');
  }
});

document.getElementById('add-bucket-button').addEventListener('click', () => {
  const bucketName = document.getElementById('new-bucket-input').value.trim();
  if (bucketName) {
    tasks[bucketName] = {};
    currentBucket = bucketName;
    renderTasks();
    updateCurrentBucketDisplay();
    document.getElementById('new-bucket-input').value = '';
  }
});

document.getElementById('save-button').addEventListener('click', saveTasks);

loadTasks();
