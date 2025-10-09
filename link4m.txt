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
            max-height: 80px;
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
        #btn-bypass {
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
        #btn-bypass:hover {
             background-color: #c82333;
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

        const bypassButton = document.createElement('button');
        bypassButton.id = 'btn-bypass';
        bypassButton.textContent = '⚡ KÍCH HOẠT BYPASS ⚡';

        content.appendChild(bypassButton);
        panel.appendChild(content);
        document.body.appendChild(panel);

        function executeBypass() {
            bypassButton.textContent = '⚙️ Đang Tải & Chạy...';
            bypassButton.disabled = true;

            GM_xmlhttpRequest({
                method: "GET",
                url: GITHUB_RAW_URL,
                onload: function(response) {
                    if (response.status === 200) {
                        const codeToRun = response.responseText.trim();
                        
                        try {
                            unsafeWindow.eval(codeToRun);
                            
                            bypassButton.style.backgroundColor = '#28a745';
                            bypassButton.textContent = '✅ BYPASS THÀNH CÔNG!';

                        } catch (e) {
                            bypassButton.style.backgroundColor = '#ffc107';
                            bypassButton.textContent = '⚠️ LỖI CHẠY CODE!';
                        }

                    } else {
                        bypassButton.style.backgroundColor = '#dc3545';
                        bypassButton.textContent = '❌ LỖI TẢI CODE!';
                    }
                    setTimeout(() => {
                        bypassButton.textContent = '⚡ KÍCH HOẠT BYPASS ⚡';
                        bypassButton.disabled = false;
                        bypassButton.style.backgroundColor = '#dc3545';
                    }, 5000);
                },
                onerror: function(error) {
                    bypassButton.style.backgroundColor = '#dc3545';
                    bypassButton.textContent = '❌ LỖI KẾT NỐI!';
                    setTimeout(() => {
                        bypassButton.textContent = '⚡ KÍCH HOẠT BYPASS ⚡';
                        bypassButton.disabled = false;
                    }, 5000);
                }
            });
        }

        bypassButton.addEventListener('click', executeBypass);

        function togglePanel() {
            const isMinimized = panel.classList.toggle('minimized');
            toggleButton.textContent = isMinimized ? '+' : '-';
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
