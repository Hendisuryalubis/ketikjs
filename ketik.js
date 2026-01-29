// ketik.js v4.0 (Modular Configuration)
// Feature: Granular Toolbar Control (Enable/Disable specific button groups)

function initKetik(targetSelector, options = {}) {
    const targetEl = document.querySelector(targetSelector);
    if (!targetEl) return;

    // --- 1. CONFIGURATION LOGIC ---
    // Default semua fitur NYALA
    const defaults = {
        history: true,  // Undo, Redo
        header: true,   // H1, H2, Paragraph
        text: true,     // Bold, Italic, Underline, Strike
        color: true,    // Text Color, BG Color
        script: true,   // Subscript, Superscript
        align: true,    // Left, Center, Right, Justify, Indent
        list: true,     // Bullet, Number, Quote, HR
        media: true,    // Link, Image, Emoji
        tools: true     // Source Code, Clear Format
    };

    let config = { ...defaults };

    // Jika user kirim 'false', matikan semua (Mode Komentar Minimalis)
    if (options === false) {
        Object.keys(config).forEach(key => config[key] = false);
    } 
    // Jika user kirim object, gabungkan dengan default
    else if (typeof options === 'object') {
        config = { ...defaults, ...options };
    }

    targetEl.style.display = 'none';

    // --- 2. BUILD UI ---
    const container = document.createElement('div');
    container.className = 'ketik-container';

    const toolbar = document.createElement('div');
    toolbar.className = 'ketik-toolbar';
    // Sembunyikan toolbar kalau semua fitur dimatikan
    if (Object.values(config).every(val => val === false)) {
        toolbar.style.display = 'none';
    }

    const emojiWrapper = document.createElement('div');
    emojiWrapper.className = 'ketik-emoji-popup'; 

    const editor = document.createElement('div');
    editor.className = 'ketik-content';
    editor.contentEditable = true;
    editor.innerHTML = targetEl.value;
    editor.setAttribute('placeholder', targetEl.getAttribute('placeholder') || 'Tulis sesuatu...');

    const sourceArea = document.createElement('textarea');
    sourceArea.className = 'ketik-source';
    sourceArea.style.display = 'none';

    const footer = document.createElement('div');
    footer.className = 'ketik-footer';
    const charCount = document.createElement('small');
    charCount.className = 'ketik-counter';
    charCount.innerText = '0 Kata | 0 Karakter';
    footer.appendChild(charCount);

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.style.display = 'none';
    let activeColorMode = 'foreColor';

    container.appendChild(toolbar);
    container.appendChild(emojiWrapper);
    container.appendChild(editor);
    container.appendChild(sourceArea);
    container.appendChild(colorInput);
    container.appendChild(footer);

    targetEl.parentNode.insertBefore(container, targetEl.nextSibling);

    // --- 3. DEFINE BUTTON GROUPS ---
    // Tombol dikelompokkan agar bisa di-filter berdasarkan config
    let toolbarGroups = [];

    if (config.history) {
        toolbarGroups.push([
            { icon: '<i class="bi bi-arrow-counterclockwise"></i>', cmd: 'undo', title: 'Undo' },
            { icon: '<i class="bi bi-arrow-clockwise"></i>', cmd: 'redo', title: 'Redo' }
        ]);
    }

    if (config.header) {
        toolbarGroups.push([
            { icon: 'H1', cmd: 'formatBlock', val: 'H1', title: 'Heading 1' },
            { icon: 'H2', cmd: 'formatBlock', val: 'H2', title: 'Heading 2' },
            { icon: '¶', cmd: 'formatBlock', val: 'P', title: 'Paragraf' }
        ]);
    }

    if (config.text) {
        toolbarGroups.push([
            { icon: '<i class="bi bi-type-bold"></i>', cmd: 'bold', title: 'Bold' },
            { icon: '<i class="bi bi-type-italic"></i>', cmd: 'italic', title: 'Italic' },
            { icon: '<i class="bi bi-type-underline"></i>', cmd: 'underline', title: 'Underline' },
            { icon: '<i class="bi bi-type-strikethrough"></i>', cmd: 'strikeThrough', title: 'Coret' }
        ]);
    }

    if (config.color) {
        toolbarGroups.push([
            { icon: '<i class="bi bi-palette"></i>', cmd: 'textColor', title: 'Warna Teks' },
            { icon: '<i class="bi bi-paint-bucket"></i>', cmd: 'bgColor', title: 'Background' }
        ]);
    }

    if (config.script) {
        toolbarGroups.push([
            { icon: 'x²', cmd: 'superscript', title: 'Superscript' },
            { icon: 'x₂', cmd: 'subscript', title: 'Subscript' }
        ]);
    }

    if (config.align) {
        toolbarGroups.push([
            { icon: '<i class="bi bi-text-left"></i>', cmd: 'justifyLeft', title: 'Kiri' },
            { icon: '<i class="bi bi-text-center"></i>', cmd: 'justifyCenter', title: 'Tengah' },
            { icon: '<i class="bi bi-text-right"></i>', cmd: 'justifyRight', title: 'Kanan' },
            { icon: '<i class="bi bi-justify"></i>', cmd: 'justifyFull', title: 'Justify' },
            { icon: '<i class="bi bi-indent"></i>', cmd: 'indent', title: 'Geser Kanan' },
            { icon: '<i class="bi bi-outdent"></i>', cmd: 'outdent', title: 'Geser Kiri' }
        ]);
    }

    if (config.list) {
        toolbarGroups.push([
            { icon: '<i class="bi bi-list-ul"></i>', cmd: 'insertUnorderedList', title: 'List Bullet' },
            { icon: '<i class="bi bi-list-ol"></i>', cmd: 'insertOrderedList', title: 'List Angka' },
            { icon: '<i class="bi bi-quote"></i>', cmd: 'formatBlock', val: 'blockquote', title: 'Quote' },
            { icon: '<i class="bi bi-hr"></i>', cmd: 'insertHorizontalRule', title: 'Garis' }
        ]);
    }

    if (config.media) {
        toolbarGroups.push([
            { icon: '<i class="bi bi-link-45deg"></i>', cmd: 'createLink', title: 'Link' },
            { icon: '<i class="bi bi-image"></i>', cmd: 'insertImage', title: 'Gambar' },
            { icon: '<i class="bi bi-emoji-smile"></i>', cmd: 'toggleEmoji', title: 'Emoji' }
        ]);
    }

    if (config.tools) {
        toolbarGroups.push([
            { icon: '<i class="bi bi-filetype-html"></i>', cmd: 'toggleSource', title: 'HTML' },
            { icon: '<i class="bi bi-eraser"></i>', cmd: 'removeFormat', title: 'Reset' }
        ]);
    }

    // --- 4. RENDER TOOLBAR ---
    let isSourceMode = false;
    const execCmd = (cmd, val = null) => { document.execCommand(cmd, false, val); syncData(); };
    colorInput.addEventListener('input', (e) => execCmd(activeColorMode, e.target.value));

    toolbarGroups.forEach((group, index) => {
        // Render Tombol dalam Group
        group.forEach(btn => {
            const b = document.createElement('button');
            b.type = 'button'; b.className = 'ketik-btn'; b.innerHTML = btn.icon; b.title = btn.title;
            
            const action = (e) => {
                e.preventDefault(); e.stopPropagation();
                if (isSourceMode && btn.cmd !== 'toggleSource') return;

                if (btn.cmd === 'toggleEmoji') { emojiWrapper.classList.toggle('show'); return; }
                emojiWrapper.classList.remove('show');

                if (btn.cmd === 'createLink') { const u = prompt('URL Link:', 'https://'); if(u) execCmd('createLink', u); }
                else if (btn.cmd === 'insertImage') { const u = prompt('URL Gambar:', 'https://'); if(u) execCmd('insertImage', u); }
                else if (btn.cmd === 'textColor') { activeColorMode = 'foreColor'; colorInput.click(); }
                else if (btn.cmd === 'bgColor') { activeColorMode = 'hiliteColor'; colorInput.click(); }
                else if (btn.cmd === 'toggleSource') {
                    isSourceMode = !isSourceMode;
                    if(isSourceMode) { sourceArea.value = editor.innerHTML; editor.style.display='none'; sourceArea.style.display='block'; toolbar.classList.add('disabled-mode'); }
                    else { editor.innerHTML = sourceArea.value; sourceArea.style.display='none'; editor.style.display='block'; toolbar.classList.remove('disabled-mode'); syncData(); }
                } else { execCmd(btn.cmd, btn.val); }
            };
            b.addEventListener('mousedown', action);
            b.addEventListener('touchstart', action, {passive: false});
            toolbar.appendChild(b);
        });

        // Tambahkan Separator antar group (kecuali group terakhir)
        if (index < toolbarGroups.length - 1) {
            const sep = document.createElement('div');
            sep.className = 'ketik-separator';
            toolbar.appendChild(sep);
        }
    });

    // --- 5. EMOJI & SYNC ---
    const emojis = ['😀','😂','😍','😎','😭','😡','👍','👎','🙏','🔥','🎉','❤️','✅','❌','⚠️','🚀','📢','💡','🤖','💰','🇮🇩','📞','👋','👀'];
    emojis.forEach(e => {
        const s = document.createElement('span'); s.innerText = e;
        const ins = (ev) => { ev.preventDefault(); ev.stopPropagation(); if(!isSourceMode) { execCmd('insertText', e); emojiWrapper.classList.remove('show'); }};
        s.addEventListener('touchstart', ins, {passive: false});
        s.addEventListener('mousedown', ins);
        emojiWrapper.appendChild(s);
    });

    const closeAll = (e) => { if (!container.contains(e.target)) emojiWrapper.classList.remove('show'); };
    document.addEventListener('click', closeAll);
    document.addEventListener('touchstart', closeAll, {passive: false});

    function syncData() {
        const content = isSourceMode ? sourceArea.value : editor.innerHTML;
        const txt = editor.innerText || '';
        targetEl.value = content;
        charCount.innerText = `${txt.trim() === '' ? 0 : txt.trim().split(/\s+/).length} Kata | ${txt.length} Karakter`;
    }
    editor.addEventListener('input', syncData);
    sourceArea.addEventListener('input', syncData);
    syncData();
}