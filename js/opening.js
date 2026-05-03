const locations = [
  {
    elementId: "location-merkstein",
    hours: {
      1: ["00:00", "00:00"],
      2: ["08:30", "21:00"],
      3: ["08:30", "21:00"],
      4: ["08:30", "21:00"],
      5: ["08:30", "21:00"],
      6: ["08:30", "21:00"],
      0: ["08:30", "21:00"],
    }
  },
  {
    elementId: "location-uebach",
    hours: {
      1: ["00:00", "00:00"],
      2: ["00:00", "00:00"],
      3: ["12:00", "20:00"],
      4: ["12:00", "20:00"],
      5: ["12:00", "20:00"],
      6: ["12:00", "20:00"],
      0: ["12:00", "20:00"]
    }
  }
];

function timeToMinutes(timeString) {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatTime(timeString) {
  return `${timeString} Uhr`;
}

function getTodaySchedule(schedule) {
  const now = new Date();
  const day = now.getDay();
  return schedule[day] || null;
}

function isOpenNow(schedule) {
  const now = new Date();
  const day = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  if (!schedule[day]) return false;

  const [openTime, closeTime] = schedule[day];
  const openMinutes = timeToMinutes(openTime);
  const closeMinutes = timeToMinutes(closeTime);

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}

function getStatusText(schedule) {
  const now = new Date();
  const todaySchedule = getTodaySchedule(schedule);

  if (!todaySchedule) {
    return {
      isOpen: false,
      note: "Heute geschlossen"
    };
  }

  const [openTime, closeTime] = todaySchedule;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = timeToMinutes(openTime);
  const closeMinutes = timeToMinutes(closeTime);

  if (currentMinutes < openMinutes) {
    return {
      isOpen: false,
      note: `Öffnet heute um ${formatTime(openTime)}`
    };
  }

  if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
    return {
      isOpen: true,
      note: `Heute geöffnet bis ${formatTime(closeTime)}`
    };
  }

  return {
    isOpen: false,
    note: "Für heute geschlossen"
  };
}

function updateLocationStatus() {
  locations.forEach((location) => {
    const card = document.getElementById(location.elementId);

    if (!card) {
      console.warn(`Element mit ID "${location.elementId}" nicht gefunden.`);
      return;
    }

    const statusElement = card.querySelector("[data-status]");
    const noteElement = card.querySelector("[data-note]");

    if (!statusElement || !noteElement) {
      console.warn(`Status- oder Hinweis-Element in "${location.elementId}" fehlt.`);
      return;
    }

    const statusInfo = getStatusText(location.hours);

    if (statusInfo.isOpen) {
      statusElement.textContent = "Jetzt geöffnet";
      statusElement.classList.remove("status-closed");
      statusElement.classList.add("status-open");
    } else {
      statusElement.textContent = "Geschlossen";
      statusElement.classList.remove("status-open");
      statusElement.classList.add("status-closed");
    }

    noteElement.textContent = statusInfo.note;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateLocationStatus();
  setInterval(updateLocationStatus, 60000);
});