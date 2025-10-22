// ==UserScript==
// @name         Bypass Link4m
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bypass https://link4m.com.
// @author       https://zyo.lol/DS_Zeus
// @match        https://link4m.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      raw.githubusercontent.com
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/ugphone839/bypass-link4m/refs/heads/main/Code';
    const HANAMI_DELAY_SECONDS = 80; // Đặt delay hiển thị là 80 giây

    GM_addStyle(`
        #bypass-control-panel-minimal {
            position: fixed;
            top: 10px;
            left: 10px;
            z-index: 99999;
            background-color: #f8f8f8;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.15);
            font-family: Arial, sans-serif;
            width: 90%;
            max-width: 300px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            gap: 8px;
            transition: width 0.3s, max-width 0.3s, padding 0.3s;
        }
        #panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: bold;
            padding: 5px;
            cursor: pointer;
        }
        #panel-content {
            display: flex;
            flex-direction: column;
            gap: 8px;
            overflow: hidden;
            transition: max-height 0.3s ease-out, opacity 0.3s ease-out;
            max-height: 120px;
        }
        .minimized #panel-content {
            max-height: 0;
            opacity: 0;
            padding: 0;
            margin: 0;
        }
        .minimized #bypass-control-panel-minimal {
            width: auto;
            max-width: 150px;
            padding: 5px 10px;
        }
        .bypass-button {
            padding: 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            font-size: 16px;
            width: 100%;
            box-sizing: border-box;
            background-color: #dc3545;
            color: white;
            transition: background-color 0.2s;
        }
        .bypass-button:hover {
             background-color: #c82333;
        }
        #btn-hanami {
            background-color: #007bff;
        }
        #btn-hanami:hover {
            background-color: #0056b3;
        }
        #btn-toggle {
            background: none;
            border: none;
            font-size: 20px;
            font-weight: bold;
            cursor: pointer;
            padding: 0;
            margin-left: 10px;
            line-height: 1;
        }
    `);

    function createMinimalControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'bypass-control-panel-minimal';
        panel.classList.add('minimized');

        const header = document.createElement('div');
        header.id = 'panel-header';
        header.innerHTML = 'Bypass Link4m';

        const toggleButton = document.createElement('button');
        toggleButton.id = 'btn-toggle';
        toggleButton.textContent = '+';

        header.appendChild(toggleButton);
        panel.appendChild(header);

        const content = document.createElement('div');
        content.id = 'panel-content';

        // Nút Bypass Link4m Gốc
        const bypassButton = document.createElement('button');
        bypassButton.id = 'btn-bypass';
        bypassButton.classList.add('bypass-button');
        bypassButton.textContent = '⚡ KÍCH HOẠT BYPASS ⚡';
        content.appendChild(bypassButton);

        // Nút Bypass Hanami Mới
        const hanamiButton = document.createElement('button');
        hanamiButton.id = 'btn-hanami';
        hanamiButton.classList.add('bypass-button');
        hanamiButton.textContent = `🌸 Bypass Hanami (${HANAMI_DELAY_SECONDS}s) 🌸`;
        content.appendChild(hanamiButton);

        panel.appendChild(content);
        document.body.appendChild(panel);

        // Hàm Reset Buttons
        function resetButtons(button) {
            const isHanami = button.id === 'btn-hanami';
            button.textContent = isHanami ? `🌸 Bypass Hanami (${HANAMI_DELAY_SECONDS}s) 🌸` : '⚡ KÍCH HOẠT BYPASS ⚡';
            button.disabled = false;
            button.style.backgroundColor = isHanami ? '#007bff' : '#dc3545';
        }

        // Hàm Thực Thi Bypass (Giữ nguyên)
        function executeBypass(button) {
            button.textContent = '⚙️ Đang Tải & Chạy...';
            button.disabled = true;

            GM_xmlhttpRequest({
                method: "GET",
                url: GITHUB_RAW_URL,
                onload: function(response) {
                    if (response.status === 200) {
                        const codeToRun = response.responseText.trim();

                        try {
                            unsafeWindow.eval(codeToRun);
                            button.style.backgroundColor = '#28a745';
                            button.textContent = '✅ BYPASS THÀNH CÔNG!';
                        } catch (e) {
                            button.style.backgroundColor = '#ffc107';
                            button.textContent = '⚠️ LỖI CHẠY CODE!';
                        }
                    } else {
                        button.style.backgroundColor = '#dc3545';
                        button.textContent = '❌ LỖI TẢI CODE!';
                    }

                    setTimeout(() => {
                        // Nếu không có countdown interval nào đang chạy, thì reset nút
                        if (!button.countdownInterval) {
                             resetButtons(button);
                        }
                    }, 5000);
                },
                onerror: function(error) {
                    button.style.backgroundColor = '#dc3545';
                    button.textContent = '❌ LỖI KẾT NỐI!';
                    setTimeout(() => {
                        resetButtons(button);
                    }, 5000);
                }
            });
        }

        // --- Xử lý cho nút Bypass Link4m Gốc ---
        bypassButton.addEventListener('click', () => executeBypass(bypassButton));

        // --- Xử lý cho nút Bypass Hanami (Bypass Tức Thì + Đồng hồ 50s) ---
        hanamiButton.addEventListener('click', function() {
            // 1. Kích hoạt bypass ngay lập tức
            executeBypass(hanamiButton);

            let countdown = HANAMI_DELAY_SECONDS;

            // Dọn dẹp bất kỳ interval nào đang chạy
            if (hanamiButton.countdownInterval) {
                clearInterval(hanamiButton.countdownInterval);
            }

            // 2. Bắt đầu đồng hồ đếm ngược *visual* (Chỉ hiển thị)
            hanamiButton.countdownInterval = setInterval(() => {
                countdown--;

                if (countdown >= 0) {
                    // Cập nhật nội dung nút
                    hanamiButton.textContent = `⏱️ BYPASSED. ĐẾM NGƯỢC: ${countdown}s`;
                    hanamiButton.style.backgroundColor = '#ffc107'; // Vàng: Trạng thái đếm ngược
                    hanamiButton.disabled = true; // Vô hiệu hóa trong lúc đếm ngược
                } else {
                    // 3. Kết thúc đếm ngược, reset nút
                    clearInterval(hanamiButton.countdownInterval);
                    hanamiButton.countdownInterval = null;
                    resetButtons(hanamiButton);
                }
            }, 1000);
        });

        // --- Logic Thu Nhỏ/Phóng To Panel ---
        function togglePanel() {
            const isMinimized = panel.classList.toggle('minimized');
            toggleButton.textContent = isMinimized ? '+' : '−';
        }
        toggleButton.addEventListener('click', togglePanel);
        header.addEventListener('click', (e) => {
            if (e.target.id !== 'btn-toggle') {
                togglePanel();
            }
        });
    }

    createMinimalControlPanel();

})();
