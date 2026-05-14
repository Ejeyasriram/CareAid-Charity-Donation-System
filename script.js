function login() {
  document.getElementById("loginSection").classList.add("hidden");
  document.getElementById("dashboardSection").classList.remove("hidden");
}

function showSection(sectionId) {
  document.querySelectorAll("section").forEach(section => {
    section.classList.add("hidden");
  });

  document.getElementById(sectionId).classList.remove("hidden");
}

function addDonation() {

  const name = document.getElementById("donorName").value;
  const email = document.getElementById("donorEmail").value;
  const amount = parseFloat(
    document.getElementById("donationAmount").value
  );

  const paymentMethod =
    document.getElementById("paymentMethod").value;

  const date = new Date().toLocaleString();

  if (!name || !email || !amount) {
    alert("Please fill in all fields.");
    return;
  }

  let total =
    parseFloat(localStorage.getItem("totalDonations")) || 0;

  total += amount;

  localStorage.setItem("totalDonations", total);

  document.getElementById("totalDonations").innerText = total;

  let donors =
    JSON.parse(localStorage.getItem("donors")) || [];

  donors.push({
    name,
    email,
    amount,
    date,
    paymentMethod
  });

  localStorage.setItem("donors", JSON.stringify(donors));

  document.getElementById("totalDonors").innerText =
    donors.length;

  document.getElementById("recentDonation").innerText =
    `$${amount} by ${name}`;

  updateChart();

  alert("Donation Added Successfully!");

  showSection("dashboardSection");
}

function loadDonorReport() {

  const donors =
    JSON.parse(localStorage.getItem("donors")) || [];

  const donorTable =
    document.getElementById("donorReportTable");

  donorTable.innerHTML = "";

  donors.forEach(donor => {

    donorTable.innerHTML += `
      <tr>
        <td class="p-2">${donor.name}</td>
        <td class="p-2">${donor.email}</td>
        <td class="p-2">$${donor.amount}</td>
        <td class="p-2">${donor.date}</td>
        <td class="p-2">${donor.paymentMethod}</td>
      </tr>
    `;
  });

  document.getElementById("totalDonors").innerText =
    donors.length;
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

let donationChart;

function updateChart() {

  const donors =
    JSON.parse(localStorage.getItem("donors")) || [];

  const labels = donors.map(d => d.name);
  const data = donors.map(d => d.amount);

  const ctx =
    document.getElementById("donationChart").getContext("2d");

  if (donationChart) {
    donationChart.destroy();
  }

  donationChart = new Chart(ctx, {
    type: "bar",

    data: {
      labels: labels,

      datasets: [{
        label: "Donation Amount",

        data: data,

        borderWidth: 1
      }]
    },

    options: {
      responsive: true
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("totalDonations").innerText =
    localStorage.getItem("totalDonations") || 0;

  const donors =
    JSON.parse(localStorage.getItem("donors")) || [];

  document.getElementById("totalDonors").innerText =
    donors.length;

  if (donors.length > 0) {

    const last = donors[donors.length - 1];

    document.getElementById("recentDonation").innerText =
      `$${last.amount} by ${last.name}`;
  }

  updateChart();
});
