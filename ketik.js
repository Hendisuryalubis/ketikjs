// ketik.js v3.0 (WordPress Style)
// Features: Full Toolbar, Color Picker, Image, Indent, Boolean Config

function initKetik(targetSelector, showToolbar = true) {
    const targetEl = document.querySelector(targetSelector);
    if (!targetEl) return;

    targetEl.style.display = 'none';

    // --- 1. STRUKTUR UI ---
    const container = document.createElement('div');
    container.className = 'ketik-container';

    const toolbar = document.createElement('div');
    toolbar.className = 'ketik-toolbar';
    if (!showToolbar) toolbar.style.display = 'none'; // Hide jika false

    const emojiWrapper = document.createElement('div');
    emojiWrapper.className = 'ketik-emoji-popup'; 

    const editor = document.createElement('div');
    editor.className = 'ketik-content';
    editor.contentEditable = true;
    editor.innerHTML = targetEl.value;
    editor.setAttribute('placeholder', targetEl.getAttribute('placeholder') || 'Mulai menulis...');

    // Source Code Area
    const sourceArea = document.createElement('textarea');
    sourceArea.className = 'ketik-source';
    sourceArea.style.display = 'none';

    // Footer
    const footer = document.createElement('div');
    footer.className = 'ketik-footer';
    const charCount = document.createElement('small');
    charCount.className = 'ketik-counter';
    charCount.innerText = '0 Kata | 0 Karakter';
    footer.appendChild(charCount);

    // Input Warna Tersembunyi (Untuk Color Picker)
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.style.display = 'none';
    let activeColorMode = 'foreColor'; // 'foreColor' or 'hiliteColor'

    container.appendChild(toolbar);
    container.appendChild(emojiWrapper);
    container.appendChild(editor);
    container.appendChild(sourceArea);
    container.appendChild(colorInput); // Hidden
    container.appendChild(footer);

    targetEl.parentNode.insertBefore(container, targetEl.nextSibling);

    // --- 2. SETUP TOMBOL (WP STYLE) ---
    // Struktur tombol dikelompokkan biar rapi
    const buttons = [
        // Group 1: History
        { icon: '<i class="bi bi-arrow-counterclockwise"></i>', cmd: 'undo', title: 'Undo' },
        { icon: '<i class="bi bi-arrow-clockwise"></i>', cmd: 'redo', title: 'Redo' },
        { separator: true },
        
        // Group 2: Header & Text Style
        { icon: 'H1', cmd: 'formatBlock', val: 'H1', title: 'Heading 1' },
        { icon: 'H2', cmd: 'formatBlock', val: 'H2', title: 'Heading 2' },
        { icon: '¶', cmd: 'formatBlock', val: 'P', title: 'Paragraf' },
        { icon: '<i class="bi bi-type-bold"></i>', cmd: 'bold', title: 'Bold (Ctrl+B)' },
        { icon: '<i class="bi bi-type-italic"></i>', cmd: 'italic', title: 'Italic (Ctrl+I)' },
        { icon: '<i class="bi bi-type-underline"></i>', cmd: 'underline', title: 'Underline (Ctrl+U)' },
        { icon: '<i class="bi bi-type-strikethrough"></i>', cmd: 'strikeThrough', title: 'Strikethrough' },
        { separator: true },

        // Group 3: Colors & Script
        { icon: '<i class="bi bi-palette"></i>', cmd: 'textColor', title: 'Warna Teks' },
        { icon: '<i class="bi bi-paint-bucket"></i>', cmd: 'bgColor', title: 'Warna Background' },
        { icon: 'x²', cmd: 'superscript', title: 'Superscript' },
        { icon: 'x₂', cmd: 'subscript', title: 'Subscript' },
        { separator: true },

        // Group 4: Alignment & Indent
        { icon: '<i class="bi bi-text-left"></i>', cmd: 'justifyLeft', title: 'Rata Kiri' },
        { icon: '<i class="bi bi-text-center"></i>', cmd: 'justifyCenter', title: 'Rata Tengah' },
        { icon: '<i class="bi bi-text-right"></i>', cmd: 'justifyRight', title: 'Rata Kanan' },
        { icon: '<i class="bi bi-justify"></i>', cmd: 'justifyFull', title: 'Justify' },
        { icon: '<i class="bi bi-indent"></i>', cmd: 'indent', title: 'Indent (Geser Kanan)' },
        { icon: '<i class="bi bi-outdent"></i>', cmd: 'outdent', title: 'Outdent (Geser Kiri)' },
        { separator: true },

        // Group 5: Lists & Elements
        { icon: '<i class="bi bi-list-ul"></i>', cmd: 'insertUnorderedList', title: 'Bullet List' },
        { icon: '<i class="bi bi-list-ol"></i>', cmd: 'insertOrderedList', title: 'Number List' },
        { icon: '<i class="bi bi-quote"></i>', cmd: 'formatBlock', val: 'blockquote', title: 'Kutipan / Quote' },
        { icon: '<i class="bi bi-hr"></i>', cmd: 'insertHorizontalRule', title: 'Garis Pembatas (HR)' },
        { separator: true },

        // Group 6: Media & Insert
        { icon: '<i class="bi bi-link-45deg"></i>', cmd: 'createLink', title: 'Link' },
        { icon: '<i class="bi bi-image"></i>', cmd: 'insertImage', title: 'Gambar (URL)' },
        { icon: '<i class="bi bi-emoji-smile"></i>', cmd: 'toggleEmoji', title: 'Emoji' },
        
        // Group 7: Tools
        { separator: true },
        { icon: '<i class="bi bi-filetype-html"></i>', cmd: 'toggleSource', title: 'Lihat HTML' },
        { icon: '<i class="bi bi-eraser"></i>', cmd: 'removeFormat', title: 'Bersihkan Format' }
    ];

    // --- 3. LOGIC UTAMA ---
    let isSourceMode = false;

    const execCmd = (command, value = null) => {
        document.execCommand(command, false, value);
        syncData();
    };

    // Handler Color Picker
    colorInput.addEventListener('input', (e) => execCmd(activeColorMode, e.target.value));

    // --- 4. RENDER TOOLBAR ---
    if (showToolbar) {
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

            const handleAction = (e) => {
                e.preventDefault(); e.stopPropagation();

                // Logic Khusus
                if (isSourceMode && btn.cmd !== 'toggleSource') return;

                switch(btn.cmd) {
                    case 'toggleEmoji':
                        emojiWrapper.classList.toggle('show');
                        break;
                    case 'createLink':
                        const url = prompt("Masukkan Link URL:", "https://");
                        if(url) execCmd('createLink', url);
                        break;
                    case 'insertImage':
                        const imgUrl = prompt("Masukkan URL Gambar:", "https://");
                        if(imgUrl) execCmd('insertImage', imgUrl);
                        break;
                    case 'textColor':
                        activeColorMode = 'foreColor';
                        colorInput.click();
                        break;
                    case 'bgColor':
                        activeColorMode = 'hiliteColor';
                        colorInput.click();
                        break;
                    case 'toggleSource':
                        toggleSourceView();
                        break;
                    default:
                        // Standard Command
                        execCmd(btn.cmd, btn.val || null);
                }
                
                if (btn.cmd !== 'toggleEmoji') emojiWrapper.classList.remove('show');
            };

            buttonEl.addEventListener('mousedown', handleAction);
            buttonEl.addEventListener('touchstart', handleAction, { passive: false });
            toolbar.appendChild(buttonEl);
        });
    }

    // --- 5. LOGIC TAMBAHAN ---
    function toggleSourceView() {
        isSourceMode = !isSourceMode;
        if (isSourceMode) {
            sourceArea.value = editor.innerHTML;
            editor.style.display = 'none';
            sourceArea.style.display = 'block';
            toolbar.classList.add('disabled-mode');
        } else {
            editor.innerHTML = sourceArea.value;
            sourceArea.style.display = 'none';
            editor.style.display = 'block';
            toolbar.classList.remove('disabled-mode');
            syncData();
        }
    }

    // Emoji Setup
    const emojis = ['😀','😂','😍','😎','😭','😡','👍','👎','🙏','🔥','🎉','❤️','✅','❌','⚠️','🚀','📢','💡','🤖','💰','🇮🇩','📞','👋','👀'];
    emojis.forEach(e => {
        const span = document.createElement('span');
        span.innerText = e;
        const insert = (ev) => {
            ev.preventDefault(); ev.stopPropagation();
            if(!isSourceMode) { execCmd('insertText', e); emojiWrapper.classList.remove('show'); }
        };
        span.addEventListener('touchstart', insert, { passive: false });
        span.addEventListener('mousedown', insert);
        emojiWrapper.appendChild(span);
    });

    // Close popups
    const closeAll = (e) => {
        if (!container.contains(e.target)) emojiWrapper.classList.remove('show');
    };
    document.addEventListener('click', closeAll);
    document.addEventListener('touchstart', closeAll, { passive: false });

    // --- 6. SYNC & COUNTER ---
    function syncData() {
        const content = isSourceMode ? sourceArea.value : editor.innerHTML;
        const cleanText = editor.innerText || '';
        const wordCount = cleanText.trim() === '' ? 0 : cleanText.trim().split(/\s+/).length;
        
        targetEl.value = content;
        charCount.innerText = `${wordCount} Kata | ${cleanText.length} Karakter`;
    }

    editor.addEventListener('input', syncData);
    sourceArea.addEventListener('input', syncData);
    syncData();
}