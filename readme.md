```markdown
# 📝 KetikJS

**Mobile-First Rich Text Editor** for modern web. Lightweight, fast, and dependency-free.
Turn any standard `<textarea>` into a powerful WYSIWYG editor with just one line of code.

!License
!Size
!Platform

---

## 🚀 Live Demo

Check out the library in action here:
👉 **https://ketik.42web.io/**

---

## ✨ Features

* 📱 **Mobile First:** Fully optimized for touch screens (touchstart support) & responsive design.
* ⚡ **Lightweight:** Pure JavaScript. No jQuery or heavy frameworks required.
* 🎨 **Modern UI:** Uses **Bootstrap Icons** for a clean, professional look.
* 😀 **Emoji Picker:** Built-in popup emoji picker with mobile touch optimization.
* 🔄 **Auto Sync:** Automatically synchronizes content with the original `<textarea>` for easy form submission.
* 🛠️ **Developer Friendly:** Supports standard HTML form submission.

---

## 📦 Installation (CDN)

You don't need to download anything. Just add these links to your HTML file.

### 1. Add CSS (Inside `<head>`)
Required for Bootstrap Icons and Editor styling.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Hendisuryalubis/ketikjs@main/ketik.css">

```

### 2. Add JS (Before `</body>`)

Logic for the editor interface.

```html
<script src="https://cdn.jsdelivr.net/gh/Hendisuryalubis/ketikjs@main/ketik.js"></script>

```

---

## ⚡ Usage

1. Create a `<textarea>` with a unique ID.
2. Initialize **KetikJS** targeting that ID.

```html
<form method="POST">
<textarea id="myEditor" name="content" placeholder="Write something amazing..."></textarea>
<button type="submit">Submit</button>
</form>

<script>
document.addEventListener("DOMContentLoaded", () => {
// Initialize the editor
initKetik('#myEditor');
});
</script>

```

---

## 🛠️ Supported Formatting

| Icon | Action | HTML Output |
| --- | --- | --- |
| **B** | Bold | `<b>text</b>` |
| *I* | Italic | `<i>text</i>` |
| <u>U</u> | Underline | `<u>text</u>` |
| <s>S</s> | Strikethrough | `<s>text</s>` |
| 🔗 | Link | `<a href="...">text</a>` |
| `</>` | Inline Code | `<code>text</code>` |
| Pre | Block Code | `<pre>text</pre>` |
| 👁️ | Spoiler | `<span class="tg-spoiler">text</span>` |
| 😀 | Emoji | Unicode Emoji |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the issues page.

---

## 👤 Author

**Hendi Surya Lubis**

* Github: @Hendisuryalubis

---

## 📝 License

Copyright © 2025 Hendi Surya Lubis.
This project is MIT licensed.

```