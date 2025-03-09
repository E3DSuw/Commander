<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta http-equiv="Content-Style-Type" content="text/css">
  <title></title>
  <meta name="Generator" content="Cocoa HTML Writer">
  <meta name="CocoaVersion" content="2487.7">
  <style type="text/css">
    p.p1 {margin: 0.0px 0.0px 0.0px 0.0px; font: 12.0px Helvetica}
    p.p2 {margin: 0.0px 0.0px 0.0px 0.0px; font: 12.0px Helvetica; min-height: 14.0px}
  </style>
</head>
<body>
<p class="p1">let tasks = {};</p>
<p class="p1">let currentBucket = null;</p>
<p class="p1">const taskListElement = document.getElementById('task-list');</p>
<p class="p1">const currentBucketDisplayElement = document.getElementById('current-bucket-display');</p>
<p class="p2"><br></p>
<p class="p1">async function loadTasks() {</p>
<p class="p1"><span class="Apple-converted-space">  </span>try {</p>
<p class="p1"><span class="Apple-converted-space">    </span>const response = await fetch('slash.txt');</p>
<p class="p1"><span class="Apple-converted-space">    </span>if (!response.ok) {</p>
<p class="p1"><span class="Apple-converted-space">      </span>throw new Error(`HTTP error! status: ${response.status}`);</p>
<p class="p1"><span class="Apple-converted-space">    </span>}</p>
<p class="p1"><span class="Apple-converted-space">    </span>const text = await response.text();</p>
<p class="p1"><span class="Apple-converted-space">    </span>tasks = {};</p>
<p class="p1"><span class="Apple-converted-space">    </span>currentBucket = null;</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>if (text.trim() === "") {</p>
<p class="p1"><span class="Apple-converted-space">      </span>renderTasks();</p>
<p class="p1"><span class="Apple-converted-space">      </span>updateCurrentBucketDisplay();</p>
<p class="p1"><span class="Apple-converted-space">      </span>return;</p>
<p class="p1"><span class="Apple-converted-space">    </span>}</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>text.split('\n').forEach(line =&gt; {</p>
<p class="p1"><span class="Apple-converted-space">      </span>line = line.trim();</p>
<p class="p1"><span class="Apple-converted-space">      </span>if (line.endsWith('&gt;')) {</p>
<p class="p1"><span class="Apple-converted-space">        </span>currentBucket = line.slice(0, -1).trim();</p>
<p class="p1"><span class="Apple-converted-space">        </span>tasks[currentBucket] = {};</p>
<p class="p1"><span class="Apple-converted-space">      </span>} else if (line.endsWith('&lt;')) {</p>
<p class="p1"><span class="Apple-converted-space">        </span>currentBucket = null;</p>
<p class="p1"><span class="Apple-converted-space">      </span>} else if (currentBucket) {</p>
<p class="p1"><span class="Apple-converted-space">        </span>line.split(';').forEach(task =&gt; {</p>
<p class="p1"><span class="Apple-converted-space">          </span>task = task.trim();</p>
<p class="p1"><span class="Apple-converted-space">          </span>if (task) {</p>
<p class="p1"><span class="Apple-converted-space">            </span>tasks[currentBucket][task] = {};</p>
<p class="p1"><span class="Apple-converted-space">          </span>}</p>
<p class="p1"><span class="Apple-converted-space">        </span>});</p>
<p class="p1"><span class="Apple-converted-space">      </span>}</p>
<p class="p1"><span class="Apple-converted-space">    </span>});</p>
<p class="p1"><span class="Apple-converted-space">    </span>renderTasks();</p>
<p class="p1"><span class="Apple-converted-space">    </span>updateCurrentBucketDisplay();</p>
<p class="p1"><span class="Apple-converted-space">  </span>} catch (error) {</p>
<p class="p1"><span class="Apple-converted-space">    </span>console.error('Error loading tasks:', error);</p>
<p class="p1"><span class="Apple-converted-space">    </span>alert('Error loading task file. Please check the console for details.');</p>
<p class="p1"><span class="Apple-converted-space">  </span>}</p>
<p class="p1">}</p>
<p class="p2"><br></p>
<p class="p1">function saveTasks() {</p>
<p class="p1"><span class="Apple-converted-space">  </span>let text = '';</p>
<p class="p1"><span class="Apple-converted-space">  </span>for (const bucket in tasks) {</p>
<p class="p1"><span class="Apple-converted-space">    </span>text += bucket + ' &gt;\n';</p>
<p class="p1"><span class="Apple-converted-space">    </span>let taskList = [];</p>
<p class="p1"><span class="Apple-converted-space">    </span>for (const task in tasks[bucket]) {</p>
<p class="p1"><span class="Apple-converted-space">      </span>taskList.push(task);</p>
<p class="p1"><span class="Apple-converted-space">    </span>}</p>
<p class="p1"><span class="Apple-converted-space">    </span>text += taskList.join('; ');</p>
<p class="p1"><span class="Apple-converted-space">    </span>text += '\n&lt;\n';</p>
<p class="p1"><span class="Apple-converted-space">  </span>}</p>
<p class="p1"><span class="Apple-converted-space">  </span>const blob = new Blob([text], { type: 'text/plain' });</p>
<p class="p1"><span class="Apple-converted-space">  </span>const url = URL.createObjectURL(blob);</p>
<p class="p1"><span class="Apple-converted-space">  </span>const a = document.createElement('a');</p>
<p class="p1"><span class="Apple-converted-space">  </span>a.href = url;</p>
<p class="p1"><span class="Apple-converted-space">  </span>a.download = 'slash.txt';</p>
<p class="p1"><span class="Apple-converted-space">  </span>document.body.appendChild(a);</p>
<p class="p1"><span class="Apple-converted-space">  </span>a.click();</p>
<p class="p1"><span class="Apple-converted-space">  </span>document.body.removeChild(a);</p>
<p class="p1"><span class="Apple-converted-space">  </span>URL.revokeObjectURL(url);</p>
<p class="p1">}</p>
<p class="p2"><br></p>
<p class="p1">function renderTasks() {</p>
<p class="p1"><span class="Apple-converted-space">  </span>const fragment = document.createDocumentFragment(); // Use a document fragment</p>
<p class="p1"><span class="Apple-converted-space">  </span>for (const bucket in tasks) {</p>
<p class="p1"><span class="Apple-converted-space">    </span>const bucketLi = document.createElement('li');</p>
<p class="p1"><span class="Apple-converted-space">    </span>bucketLi.textContent = bucket + ':';</p>
<p class="p1"><span class="Apple-converted-space">    </span>bucketLi.classList.add('bucket');</p>
<p class="p1"><span class="Apple-converted-space">    </span>bucketLi.addEventListener('click', () =&gt; {</p>
<p class="p1"><span class="Apple-converted-space">      </span>currentBucket = bucket;</p>
<p class="p1"><span class="Apple-converted-space">      </span>updateCurrentBucketDisplay();</p>
<p class="p1"><span class="Apple-converted-space">    </span>});</p>
<p class="p1"><span class="Apple-converted-space">    </span>const subUl = document.createElement('ul');</p>
<p class="p1"><span class="Apple-converted-space">    </span>for (const task in tasks[bucket]) {</p>
<p class="p1"><span class="Apple-converted-space">      </span>const taskLi = document.createElement('li');</p>
<p class="p1"><span class="Apple-converted-space">      </span>taskLi.textContent = task;</p>
<p class="p1"><span class="Apple-converted-space">      </span>subUl.appendChild(taskLi);</p>
<p class="p1"><span class="Apple-converted-space">    </span>}</p>
<p class="p1"><span class="Apple-converted-space">    </span>bucketLi.appendChild(subUl);</p>
<p class="p1"><span class="Apple-converted-space">    </span>fragment.appendChild(bucketLi); // Append to fragment</p>
<p class="p1"><span class="Apple-converted-space">  </span>}</p>
<p class="p1"><span class="Apple-converted-space">  </span>taskListElement.innerHTML = ''; // Clear once</p>
<p class="p1"><span class="Apple-converted-space">  </span>taskListElement.appendChild(fragment); // Append fragment once</p>
<p class="p1">}</p>
<p class="p2"><br></p>
<p class="p1">function updateCurrentBucketDisplay() {</p>
<p class="p1"><span class="Apple-converted-space">  </span>currentBucketDisplayElement.textContent = `Current Bucket: ${currentBucket || 'None'}`;</p>
<p class="p1">}</p>
<p class="p2"><br></p>
<p class="p1">document.getElementById('add-task-button').addEventListener('click', () =&gt; {</p>
<p class="p1"><span class="Apple-converted-space">  </span>const taskName = document.getElementById('new-task-input').value.trim();</p>
<p class="p1"><span class="Apple-converted-space">  </span>if (taskName &amp;&amp; currentBucket) {</p>
<p class="p1"><span class="Apple-converted-space">    </span>tasks[currentBucket][taskName] = {};</p>
<p class="p1"><span class="Apple-converted-space">    </span>renderTasks();</p>
<p class="p1"><span class="Apple-converted-space">    </span>document.getElementById('new-task-input').value = '';</p>
<p class="p1"><span class="Apple-converted-space">  </span>} else if (!currentBucket) {</p>
<p class="p1"><span class="Apple-converted-space">    </span>alert('Please select a bucket before adding a task.');</p>
<p class="p1"><span class="Apple-converted-space">  </span>}</p>
<p class="p1">});</p>
<p class="p2"><br></p>
<p class="p1">document.getElementById('add-bucket-button').addEventListener('click', () =&gt; {</p>
<p class="p1"><span class="Apple-converted-space">  </span>const bucketName = document.getElementById('new-bucket-input').value.trim();</p>
<p class="p1"><span class="Apple-converted-space">  </span>if (bucketName) {</p>
<p class="p1"><span class="Apple-converted-space">    </span>tasks[bucketName] = {};</p>
<p class="p1"><span class="Apple-converted-space">    </span>currentBucket = bucketName;</p>
<p class="p1"><span class="Apple-converted-space">    </span>renderTasks();</p>
<p class="p1"><span class="Apple-converted-space">    </span>updateCurrentBucketDisplay();</p>
<p class="p1"><span class="Apple-converted-space">    </span>document.getElementById('new-bucket-input').value = '';</p>
<p class="p1"><span class="Apple-converted-space">  </span>}</p>
<p class="p1">});</p>
<p class="p2"><br></p>
<p class="p1">document.getElementById('save-button').addEventListener('click', saveTasks);</p>
<p class="p2"><br></p>
<p class="p1">loadTasks();</p>
</body>
</html>
