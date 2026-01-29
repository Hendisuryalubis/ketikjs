// ketik.js
// Rich Text Editor: Auto-UI, Bootstrap Icons, Emoji Popup

function initKetik(targetSelector) {
    const targetEl = document.querySelector(targetSelector);
    if (!targetEl) return;

    targetEl.style.display = 'none';

    // --- 1. STRUKTUR UI ---
    const container = document.createElement('div');
    container.className = 'ketik-container';

    // Toolbar Wrapper
    const toolbar = document.createElement('div');
    toolbar.className = 'ketik-toolbar';

    // Emoji Popup Container (Hidden by default)
    const emojiWrapper = document.createElement('div');
    emojiWrapper.className = 'ketik-emoji-popup'; 
    // Grid emoji nanti dimasukkan ke sini

    // Editor Area
    const editor = document.createElement('div');
    editor.className = 'ketik-content';
    editor.contentEditable = true;
    editor.innerHTML = targetEl.value;
    editor.setAttribute('placeholder', targetEl.getAttribute('placeholder') || 'Tulis sesuatu...');

    // Footer (Hanya untuk Counter sekarang)
    const footer = document.createElement('div');
    footer.className = 'ketik-footer';
    const charCount = document.createElement('small');
    charCount.className = 'ketik-counter';
    charCount.innerText = '0 Karakter';
    footer.appendChild(charCount);

    // Rakit DOM
    container.appendChild(toolbar);
    container.appendChild(emojiWrapper); // Popup ditaruh setelah toolbar
    container.appendChild(editor);
    container.appendChild(footer);

    targetEl.parentNode.insertBefore(container, targetEl.nextSibling);

    // --- 2. LIST TOMBOL ---
    const buttons = [
        { icon: '<i class="bi bi-type-bold"></i>', cmd: 'bold', title: 'Tebal' },
        { icon: '<i class="bi bi-type-italic"></i>', cmd: 'italic', title: 'Miring' },
        { icon: '<i class="bi bi-type-underline"></i>', cmd: 'underline', title: 'Garis Bawah' },
        { icon: '<i class="bi bi-type-strikethrough"></i>', cmd: 'strikeThrough', title: 'Coret' },
        { separator: true },
        { icon: '<i class="bi bi-link-45deg"></i>', cmd: 'createLink', title: 'Link' },
        { icon: '<i class="bi bi-code-slash"></i>', cmd: 'code', title: 'Inline Code' },
        { icon: '<i class="bi bi-file-earmark-code"></i>', cmd: 'pre', title: 'Block Code' },
        { icon: '<i class="bi bi-eye-slash"></i>', cmd: 'tg-spoiler', title: 'Spoiler' },
        { separator: true },
        // Tombol Emoji Baru
        { icon: '<i class="bi bi-emoji-smile"></i>', cmd: 'toggleEmoji', title: 'Pilih Emoji' },
        { icon: '<i class="bi bi-eraser"></i>', cmd: 'clean', title: 'Hapus Format' }
    ];

    // --- 3. CORE FUNCTIONS ---
    const execCmd = (command, value = null) => {
        document.execCommand(command, false, value);
        editor.focus();
        syncData();
    };

    const insertHtmlTag = (tagName) => {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        const text = selection.toString();
        if(!text) return; 

        let html = '';
        if (tagName === 'code') html = `<code>${text}</code>`;
        else if (tagName === 'pre') html = `<pre>${text}</pre>`;
        else if (tagName === 'tg-spoiler') html = `<span class="tg-spoiler">${text}</span>`;
        
        document.execCommand('insertHTML', false, html);
        syncData();
    };

    // --- 4. GENERATE TOOLBAR ---
    buttons.forEach(btn => {
        if (btn.separator) {
            const sep = document.createElement('div');
            sep.className = 'ketik-separator';
            toolbar.appendChild(sep);
            return;
        }

        const buttonEl = document.createElement('button');
        buttonEl.type = 'button';
        buttonEl.className = 'ketik-btn';
        buttonEl.innerHTML = btn.icon;
        buttonEl.title = btn.title;
        
        // Handler Klik
        const handleAction = (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Logic khusus Emoji
            if (btn.cmd === 'toggleEmoji') {
                emojiWrapper.classList.toggle('show'); // Toggle class CSS
                return;
            }

            // Tutup emoji jika tombol lain ditekan
            emojiWrapper.classList.remove('show');

            if (btn.cmd === 'createLink') {
                const url = prompt("Masukkan URL:", "https://");
                if (url) execCmd(btn.cmd, url);
            } 
            else if (['code', 'pre', 'tg-spoiler'].includes(btn.cmd)) {
                insertHtmlTag(btn.cmd);
            }
            else if (btn.cmd === 'clean') {
                execCmd('removeFormat');
                execCmd('unlink');
            }
            else {
                execCmd(btn.cmd);
            }
        };

        buttonEl.addEventListener('mousedown', handleAction);
        buttonEl.addEventListener('touchstart', handleAction, { passive: false });
        toolbar.appendChild(buttonEl);
    });

    // --- 5. SETUP EMOJI GRID ---
    const emojis = [
        '😀','😂','😍','😎','😭','😡','👍','👎','🙏','🔥','🎉','❤️',
        '✅','❌','⚠️','🚀','📢','💡','🤖','💰','🇮🇩','📞','👋','👀'
    ];

    emojis.forEach(e => {
        const span = document.createElement('span');
        span.innerText = e;
        span.onclick = (ev) => {
            ev.preventDefault();
            execCmd('insertText', e);
            emojiWrapper.classList.remove('show'); // Tutup setelah pilih
        };
        emojiWrapper.appendChild(span);
    });

    // Klik di luar emoji untuk menutup popup
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            emojiWrapper.classList.remove('show');
        }
    });

    // --- 6. SYNC DATA ---
    function syncData() {
        targetEl.value = editor.innerHTML;
        const textLen = editor.innerText.trim().length;
        charCount.innerText = textLen + " Karakter";
    }

    editor.addEventListener('input', syncData);
    syncData();
}
