class Member {
    constructor(name, upline = null) {
      this.name = name;
      this.upline = upline;
      this.downlines = [];
      this.bonus = 0;
      this.id = Member.counter++;
    }

    recruit(downlineName) {
      const newMember = new Member(downlineName, this);
      this.downlines.push(newMember);
      this.updateBonus(100);
      return newMember;
    }

    updateBonus(amount) {
      this.bonus += amount;
      if (this.upline) {
        this.upline.updateBonus(amount * 0.1);
      }
    }
  }
  Member.counter = 1;

  const founder = new Member("Founder");

  function renderTree(member, container) {
    const div = document.createElement("div");
    div.className = "member";
    div.innerHTML = `<strong>${member.name}</strong> - Bonus: Rp ${member.bonus.toFixed(2)}`;

    const form = document.createElement("form");
    form.className = "rekrut-form";
    form.onsubmit = e => {
      e.preventDefault();
      const input = e.target.elements["name"];
      const newMember = member.recruit(input.value || "Anon");
      renderAll();
    };

    form.innerHTML = `
      <input name="name" placeholder="Nama downline" required>
      <button type="submit">Tambah Downline</button>
    `;

    div.appendChild(form);
    container.appendChild(div);

    member.downlines.forEach(child => renderTree(child, div));
  }

  function gatherMembers(member, list = []) {
    list.push(member);
    member.downlines.forEach(child => gatherMembers(child, list));
    return list;
  }

  let chart = null;

  function updateChart() {
    const members = gatherMembers(founder);
    const labels = members.map(m => m.name);
    const bonuses = members.map(m => m.bonus);

    const data = {
      labels,
      datasets: [{
        label: 'Bonus per Member',
        data: bonuses,
        backgroundColor: 'rgba(76, 175, 80, 0.6)',
        borderColor: '#388e3c',
        borderWidth: 1
      }]
    };

    const config = {
      type: 'bar',
      data,
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { ticks: { color: '#222' } },
          y: { ticks: { color: '#222' } }
        }
      }
    };

    if (chart) chart.destroy();
    chart = new Chart(document.getElementById("bonusChart"), config);
  }

  function renderAll() {
    const container = document.getElementById("tree");
    container.innerHTML = "";
    renderTree(founder, container);
    updateChart();
  }

  function startSimulation() {
    document.getElementById("overlay").style.display = "none";
    renderAll();
  }