let num = parseInt(prompt("Enter a positive integer:"));

if (isNaN(num) || num <= 0) {
    alert("Please enter a valid positive integer.");
} else {
    let tableHTML = "<table>";

    for (let i = 1; i <= num; i++) {
        tableHTML += "<tr>";
        for (let j = 1; j <= num; j++) {
            tableHTML += `<td>${i * j}</td>`;
        }
        tableHTML += "</tr>";
    }

    tableHTML += "</table>";

    document.getElementById("table-container").innerHTML = tableHTML;
}
