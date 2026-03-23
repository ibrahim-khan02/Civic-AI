/* // Submit complaint
async function submitComplaint() {
  try {
    console.log("Button clicked");

    const text = document.getElementById("complaintText").value;

    const res = await fetch("/api/complaints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const data = await res.json();
    console.log(data);

    document.getElementById("complaintText").value = "";
    loadComplaints();

  } catch (err) {
    console.error("Error:", err);
  }
}

// Badge helpers
function getPriorityBadge(priority) {
  if (priority === "High") return "danger";
  if (priority === "Medium") return "warning";
  return "secondary";
}

function getCategoryBadge(category) {
  if (category === "Water") return "info";
  if (category === "Road") return "dark";
  if (category === "Electricity") return "primary";
  return "secondary";
}

// Mark as resolved
async function markResolved(id) {
  await fetch(`/api/complaints/${id}`, {
    method: "PUT"
  });

  loadComplaints();
}

// Load all complaints
async function loadComplaints() {
  const res = await fetch("/api/complaints");
  const data = await res.json();

  const list = document.getElementById("list");
  list.innerHTML = "";

  //  Empty state
  if (data.length === 0) {
    list.innerHTML = "<p class='text-muted'>No complaints yet</p>";
    return;
  }
  // Dashboard counts
let total = data.length;
let high = 0;
let pending = 0;
let resolved = 0;

data.forEach(c => {
  if (c.priority === "High") high++;
  if (c.status === "Pending") pending++;
  if (c.status === "Resolved") resolved++;
});

// Update UI
document.getElementById("totalCount").innerText = total;
document.getElementById("highCount").innerText = high;
document.getElementById("pendingCount").innerText = pending;
document.getElementById("resolvedCount").innerText = resolved;

  data.forEach(c => {
    const li = document.createElement("li");

    // Layout improvement
    li.className = "list-group-item d-flex justify-content-between align-items-start";

    // Capitalize first letter
    const formattedText =
      c.text.charAt(0).toUpperCase() + c.text.slice(1);

    li.innerHTML = `
      <div>
        <strong>${formattedText}</strong><br>

        <span class="badge bg-${getCategoryBadge(c.category)} me-2">
          ${c.category}
        </span>

        <span class="badge bg-${getPriorityBadge(c.priority)}">
          ${c.priority}
        </span>
      </div>

      <div class="text-end">
        <span class="badge px-3 py-2 bg-${
          c.status === "Resolved" ? "success" : "secondary"
        } me-2">
          ${c.status}
        </span>

        ${
          c.status !== "Resolved"
            ? `<button class="btn btn-sm btn-outline-success"
                onclick="markResolved('${c._id}')">
                Resolve
              </button>`
            : ""
        }
      </div>
    `;

    list.appendChild(li);
  });
}

// Load on start
loadComplaints();
// chatbot logic 
function getBotReply(input) {
  input = input.toLowerCase();

  if (input.includes("complaint")) {
    return "You can submit a complaint using the form above.";
  }
  else if (input.includes("status")) {
    return "All complaints are currently marked as Pending or Resolved.";
  }
  else if (input.includes("types")) {
    return "We handle issues like Water, Road, and Electricity.";
  }
  else if (input.includes("urgent")) {
    return "Urgent complaints are automatically marked as High priority.";
  }
  else {
    return "Sorry, I didn't understand. Please try again.";
  }
}
// display message
function sendMessage() {
  const input = document.getElementById("userInput").value;

  const chatbox = document.getElementById("chatbox");

  chatbox.innerHTML += `<p><b>You:</b> ${input}</p>`;

  const reply = getBotReply(input);

  chatbox.innerHTML += `<p><b>Bot:</b> ${reply}</p>`;

  document.getElementById("userInput").value = "";
} */
// Submit complaint
async function submitComplaint() {
  try {
    console.log("Button clicked");

    const text = document.getElementById("complaintText").value.trim();

    // Validation
    if (!text) {
      alert("Please enter a complaint!");
      return;
    }

    const res = await fetch("/api/complaints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    //  Check response
    if (!res.ok) throw new Error("Failed to submit complaint");

    const data = await res.json();
    console.log(data);

    document.getElementById("complaintText").value = "";
    loadComplaints();

  } catch (err) {
    console.error("Error:", err);
    alert("Something went wrong!");
  }
}

// Badge helpers
function getPriorityBadge(priority) {
  if (priority === "High") return "danger";
  if (priority === "Medium") return "warning";
  return "secondary";
}

function getCategoryBadge(category) {
  if (category === "Water") return "info";
  if (category === "Road") return "dark";
  if (category === "Electricity") return "primary";
  return "secondary";
}

// Mark as resolved
async function markResolved(id) {
  try {
    const res = await fetch(`/api/complaints/${id}`, {
      method: "PUT"
    });

    if (!res.ok) throw new Error("Update failed");

    loadComplaints();

  } catch (err) {
    console.error(err);
    alert("Failed to update complaint");
  }
}

// Load all complaints
async function loadComplaints() {
  try {
    const res = await fetch("/api/complaints");

    if (!res.ok) throw new Error("Failed to fetch data");

    const data = await res.json();

    const list = document.getElementById("list");
    list.innerHTML = "";

    //  Empty state
    if (!data || data.length === 0) {
      list.innerHTML = "<p class='text-muted'>No complaints yet</p>";
      updateDashboard(0, 0, 0, 0);
      return;
    }

    // Dashboard counts
    let total = data.length;
    let high = 0;
    let pending = 0;
    let resolved = 0;

    data.forEach(c => {
      if (c.priority === "High") high++;
      if (c.status === "Pending") pending++;
      if (c.status === "Resolved") resolved++;
    });

    updateDashboard(total, high, pending, resolved);

    // Render list
    data.forEach(c => {
      const li = document.createElement("li");

      li.className = "list-group-item d-flex justify-content-between align-items-start";

      //  Safe text handling
      const text = c.text || "No description";

      const formattedText =
        text.charAt(0).toUpperCase() + text.slice(1);

      li.innerHTML = `
        <div>
          <strong>${formattedText}</strong><br>

          <span class="badge bg-${getCategoryBadge(c.category)} me-2">
            ${c.category || "General"}
          </span>

          <span class="badge bg-${getPriorityBadge(c.priority)}">
            ${c.priority || "Normal"}
          </span>
        </div>

        <div class="text-end">
          <span class="badge px-3 py-2 bg-${
            c.status === "Resolved" ? "success" : "secondary"
          } me-2">
            ${c.status || "Pending"}
          </span>

          ${
            c.status !== "Resolved"
              ? `<button class="btn btn-sm btn-outline-success"
                  onclick="markResolved('${c._id}')">
                  Resolve
                </button>`
              : ""
          }
        </div>
      `;

      list.appendChild(li);
    });

  } catch (err) {
    console.error(err);
    alert("Error loading complaints");
  }
}

// Dashboard updater (clean separation)
function updateDashboard(total, high, pending, resolved) {
  document.getElementById("totalCount").innerText = total;
  document.getElementById("highCount").innerText = high;
  document.getElementById("pendingCount").innerText = pending;
  document.getElementById("resolvedCount").innerText = resolved;
}

// Load on start
loadComplaints();


// ================= CHATBOT =================

// chatbot logic
function getBotReply(input) {
  input = input.toLowerCase();

  if (input.includes("complaint")) {
    return "You can submit a complaint using the form above.";
  }
  else if (input.includes("status")) {
    return "Complaints are either Pending or Resolved.";
  }
  else if (input.includes("types")) {
    return "We handle Water, Road, Electricity, and more.";
  }
  else if (input.includes("urgent")) {
    return "Urgent complaints are marked as High priority.";
  }
  else {
    return "Sorry, I didn't understand. Try asking about complaints or status.";
  }
}

// display message
function sendMessage() {
  const inputField = document.getElementById("userInput");
  const input = inputField.value.trim();

  const chatbox = document.getElementById("chatbox");

  //  Prevent empty messages
  if (!input) return;

  chatbox.innerHTML += `<p><b>You:</b> ${input}</p>`;

  const reply = getBotReply(input);

  chatbox.innerHTML += `<p><b>Bot:</b> ${reply}</p>`;

  inputField.value = "";

  //  Auto scroll
  chatbox.scrollTop = chatbox.scrollHeight;
}