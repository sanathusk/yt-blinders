(() => {
	var html = document.documentElement;
	var toggleBtn = document.getElementById("themeToggleBtn");
	var iconSun = document.getElementById("themeIconSun");
	var iconMoon = document.getElementById("themeIconMoon");

	// Initialize theme from storage or system preference
	var savedTheme = localStorage.getItem("yt-blinders-theme");
	if (savedTheme) {
		setTheme(savedTheme);
	} else if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
		setTheme("dark");
	} else {
		setTheme("light");
	}

	function setTheme(theme) {
		html.setAttribute("data-theme", theme);
		localStorage.setItem("yt-blinders-theme", theme);
		if (theme === "dark") {
			iconSun.style.display = "block";
			iconMoon.style.display = "none";
		} else {
			iconSun.style.display = "none";
			iconMoon.style.display = "block";
		}
	}

	toggleBtn.addEventListener("click", () => {
		var current = html.getAttribute("data-theme");
		setTheme(current === "dark" ? "light" : "dark");
	});
})();
