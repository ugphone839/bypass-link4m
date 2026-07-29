// ==UserScript==
// @name         Auto Lấy Mã - Pro Max
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Tự động click nút lấy mã
// @author       Ds_Zeus
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    if (window.__AutoLayMa_Running) return;
    window.__AutoLayMa_Running = true;

    let isRunning = false;

    function speedUpTimer() {
        const originalSetInterval = window.setInterval;
        window.setInterval = function(callback, delay) {
            if (delay === 1000) {
                return originalSetInterval.call(this, callback, 10);
            }
            return originalSetInterval.call(this, callback, delay);
        };
        try {
            window.localStorage.setItem('cache_time', '0');
            window.localStorage.setItem('cache_remain_time', '0');
        } catch(e){}
    }

    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.top = '20px';
    wrapper.style.right = '20px';
    wrapper.style.zIndex = '2147483647';
    wrapper.style.fontFamily = 'sans-serif';

    const circleBtn = document.createElement('div');
    circleBtn.innerHTML = '+';
    circleBtn.style.cssText = 'width:45px;height:45px;border-radius:50%;background:#3b82f6;color:white;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:bold;cursor:move;box-shadow:0 4px 10px rgba(0,0,0,0.3);transition:background 0.3s, box-shadow 0.3s;user-select:none;';
    
    const menuPanel = document.createElement('div');
    menuPanel.style.cssText = 'background:#1e293b;color:white;padding:15px;border-radius:10px;width:260px;box-shadow:0 10px 25px rgba(0,0,0,0.5);border:1px solid #334155;display:none;';
    
    menuPanel.innerHTML = "<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;'>" +
            "<b style='color:#10b981;font-size:14px;'>🚀 Auto Lấy Mã Pro</b>" +
            "<button id='alm-close-menu' style='background:transparent;border:none;color:white;cursor:pointer;font-size:24px;line-height:1;'>&times;</button>" +
        "</div>" +
        "<div id='alm-content'>" +
            "<button id='alm-toggle-btn' style='width:100%;padding:10px;border:none;border-radius:5px;font-weight:bold;cursor:pointer;background:#ef4444;color:white;margin-bottom:10px;transition:0.2s;'>" +
                "🔴 Đang Tắt (Nhấn Bật)" +
            "</button>" +
            "<div style='font-size:12px;color:#94a3b8;margin-bottom:5px;'>Logs:</div>" +
            "<div id='alm-logs' style='height:120px;overflow-y:auto;background:#0f172a;padding:5px;border-radius:5px;font-size:11px;font-family:monospace;color:#a7f3d0;display:flex;flex-direction:column;gap:4px;'>" +
            "</div>" +
        "</div>";

    wrapper.appendChild(circleBtn);
    wrapper.appendChild(menuPanel);
    document.body.appendChild(wrapper);

    // --- Kéo thả Menu ---
    let isDragging = false;
    let hasDragged = false;
    let startX, startY, initialLeft, initialTop;

    function onDragStart(e) {
        if (e.type === 'touchstart') {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        } else {
            startX = e.clientX;
            startY = e.clientY;
            e.preventDefault();
        }
        
        const rect = wrapper.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;
        
        isDragging = true;
        hasDragged = false;
        
        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', onDragEnd);
        document.addEventListener('touchmove', onDragMove, {passive: false});
        document.addEventListener('touchend', onDragEnd);
    }

    function onDragMove(e) {
        if (!isDragging) return;
        let clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        let clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        
        let dx = clientX - startX;
        let dy = clientY - startY;
        
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
            hasDragged = true;
        }

        if (hasDragged) {
            if (e.cancelable) e.preventDefault();
            wrapper.style.right = 'auto'; // Vô hiệu hoá right để dùng left
            wrapper.style.bottom = 'auto'; 
            wrapper.style.left = (initialLeft + dx) + 'px';
            wrapper.style.top = (initialTop + dy) + 'px';
        }
    }

    function onDragEnd() {
        isDragging = false;
        document.removeEventListener('mousemove', onDragMove);
        document.removeEventListener('mouseup', onDragEnd);
        document.removeEventListener('touchmove', onDragMove);
        document.removeEventListener('touchend', onDragEnd);
    }

    circleBtn.addEventListener('mousedown', onDragStart);
    circleBtn.addEventListener('touchstart', onDragStart, {passive: false});

    circleBtn.onclick = (e) => {
        if (hasDragged) {
            e.preventDefault();
            return;
        }
        circleBtn.style.display = 'none';
        menuPanel.style.display = 'block';
    };
    // -------------------

    const toggleBtn = document.getElementById('alm-toggle-btn');
    const closeMenuBtn = document.getElementById('alm-close-menu');
    const logsDiv = document.getElementById('alm-logs');

    closeMenuBtn.onclick = () => {
        menuPanel.style.display = 'none';
        circleBtn.style.display = 'flex';
    };

    function addLog(msg) {
        const time = new Date().toLocaleTimeString();
        const logItem = document.createElement('div');
        logItem.innerText = "[" + time + "] " + msg;
        logsDiv.appendChild(logItem);
        logsDiv.scrollTop = logsDiv.scrollHeight;
        console.log("%c[AutoLấyMã] %c" + msg, 'color: #10b981; font-weight: bold;', 'color: inherit;');
    }

    toggleBtn.onclick = () => {
        isRunning = !isRunning;
        if (isRunning) {
            toggleBtn.style.background = '#3b82f6';
            toggleBtn.innerText = '🟢 Đang Bật (Nhấn Tắt)';
            circleBtn.style.background = '#10b981';
            circleBtn.style.boxShadow = '0 0 12px #10b981';
            addLog("Đã bật Auto. Đang tua timer...");
            speedUpTimer();
            startAutoLoop();
        } else {
            toggleBtn.style.background = '#ef4444';
            toggleBtn.innerText = '🔴 Đang Tắt (Nhấn Bật)';
            circleBtn.style.background = '#3b82f6';
            circleBtn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
            addLog("Đã tắt Auto.");
        }
    };

    function simulateRealClick(element, clientX, clientY) {
        let x = clientX, y = clientY;
        
        if (element && x === undefined) {
            const rect = element.getBoundingClientRect();
            x = rect.left + rect.width / 2;
            y = rect.top + rect.height / 2;
        }

        const circle = document.createElement('div');
        circle.style.position = 'fixed';
        const size = 30;
        circle.style.left = (x - size/2) + 'px';
        circle.style.top = (y - size/2) + 'px';
        circle.style.width = size + 'px';
        circle.style.height = size + 'px';
        circle.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
        circle.style.border = '2px solid red';
        circle.style.borderRadius = '50%';
        circle.style.zIndex = '2147483647';
        circle.style.pointerEvents = 'none';
        circle.style.transition = 'transform 0.3s, opacity 0.3s';
        document.body.appendChild(circle);

        requestAnimationFrame(() => {
            circle.style.transform = 'scale(1.5)';
            circle.style.opacity = '0';
        });

        setTimeout(() => circle.remove(), 300);

        const targetNode = element || document.elementFromPoint(x, y) || document.body;
        const opts = { bubbles: true, cancelable: true, clientX: x, clientY: y, pointerId: 1, isPrimary: true, buttons: 1 };
        
        try { targetNode.dispatchEvent(new PointerEvent('pointerdown', opts)); } catch(e){}
        try { targetNode.dispatchEvent(new MouseEvent('mousedown', opts)); } catch(e){}
        try { targetNode.dispatchEvent(new TouchEvent('touchstart', opts)); } catch(e){}
        
        setTimeout(() => {
            try { targetNode.dispatchEvent(new PointerEvent('pointerup', opts)); } catch(e){}
            try { targetNode.dispatchEvent(new MouseEvent('mouseup', opts)); } catch(e){}
            try { targetNode.dispatchEvent(new TouchEvent('touchend', opts)); } catch(e){}
            try { targetNode.dispatchEvent(new MouseEvent('click', opts)); } catch(e){}
            if (element && typeof element.click === 'function') {
                try { element.click(); } catch(e) {}
            }
        }, 50);
    }

    function doMultipleClicks(element, count) {
        let current = 0;
        addLog("Bắt đầu click " + count + " lần liên tiếp...");
        const interval = setInterval(() => {
            if (current >= count || !isRunning) {
                clearInterval(interval);
                return;
            }
            simulateRealClick(element);
            current++;
        }, 200);
    }

    let lastAntiBotTime = 0;

    function checkInstructions() {
        if (Date.now() - lastAntiBotTime < 5000) return;

        const text = document.body.innerText.toLowerCase();
        let acted = false;
        
        if (text.includes('kéo lên') || text.includes('cuộn lên') || text.includes('lên trên cùng')) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            addLog("⚠️ Phát hiện yêu cầu kéo lên. Đang cuộn...");
            acted = true;
        } 
        else if (text.includes('kéo xuống') || text.includes('cuộn xuống') || text.includes('xuống dưới cùng')) {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            addLog("⚠️ Phát hiện yêu cầu kéo xuống. Đang cuộn...");
            acted = true;
        }
        
        if (text.includes('click vào màn hình') || text.includes('chạm vào màn hình') || text.includes('nhấp vào màn hình') || text.includes('click bất kỳ')) {
            addLog("⚠️ Phát hiện yêu cầu chạm. Đang click 3 lần...");
            for(let i = 0; i < 3; i++) {
                setTimeout(() => {
                    const x = Math.random() * window.innerWidth * 0.6 + window.innerWidth * 0.2;
                    const y = Math.random() * window.innerHeight * 0.6 + window.innerHeight * 0.2;
                    simulateRealClick(null, x, y);
                }, i * 400);
            }
            acted = true;
        }

        if (text.includes('nhấn bài viết bất kỳ') || text.includes('click bài viết bất kỳ') || text.includes('vui lòng nhấn bài viết')) {
            addLog("⚠️ Yêu cầu click bài viết. Đang tìm link...");
            const links = Array.from(document.querySelectorAll('a[href]'));
            const internalLinks = links.filter(a => {
                try {
                    const url = new URL(a.href, window.location.href);
                    return url.origin === window.location.origin && url.pathname !== window.location.pathname && url.pathname.length > 1;
                } catch(e) { return false; }
            });
            if (internalLinks.length > 0) {
                const randomLink = internalLinks[Math.floor(Math.random() * internalLinks.length)];
                addLog("🔗 Đang chuyển hướng bài viết mới...");
                window.location.href = randomLink.href;
            } else {
                addLog("❌ Không tìm thấy bài viết nào!");
            }
            acted = true;
        }

        if (text.includes('xác thực bảo mật') || text.includes('captcha lỗi')) {
            addLog("⚠️ Phát hiện bảng Captcha. Đã tạm dừng Auto để bạn tự giải!");
            const allBtns = document.querySelectorAll('button, a, div, span');
            let closed = false;
            for (let btn of allBtns) {
                if (btn.innerText && btn.innerText.trim().toLowerCase() === 'đóng') {
                    simulateRealClick(btn);
                    addLog("✅ Đã bấm Đóng bảng Captcha.");
                    closed = true;
                    break;
                }
            }
            if (!closed) {
                // Try finding by text or class if needed, or close button in corner
                const closeBtn = document.querySelector('.close, [aria-label="Close"]');
                if (closeBtn) {
                    simulateRealClick(closeBtn);
                    addLog("✅ Đã bấm nút X tắt Captcha.");
                }
            }
            acted = true;
        }

        if (acted) {
            lastAntiBotTime = Date.now();
        } else {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
    }

    function findAndClickButton() {
        const allElements = document.querySelectorAll('*');
        let targetBtn = null;
        let bestScore = -1;

        for (let btn of allElements) {
            if (btn.tagName === 'SCRIPT' || btn.tagName === 'STYLE') continue;

            const text = btn.innerText ? btn.innerText.trim().toLowerCase() : '';
            if (text === 'lấy mã' || text === 'lay ma' || text === 'get code') {
                // Find innermost element
                let hasChildWithSameText = false;
                for (let child of btn.children) {
                    if (child.innerText && child.innerText.trim().toLowerCase() === text) {
                        hasChildWithSameText = true;
                        break;
                    }
                }
                if (hasChildWithSameText) continue;

                const style = window.getComputedStyle(btn);
                if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {
                    let score = 0;
                    if (btn.tagName === 'SPAN') score = 10;
                    else if (btn.tagName === 'BUTTON' || btn.tagName === 'A') score = 5;
                    else score = 1;
                    
                    if (score > bestScore) {
                        bestScore = score;
                        targetBtn = btn;
                    }
                }
            }
        }

        if (targetBtn) {
            addLog("✅ Đã tìm thấy nút LẤY MÃ. Chuẩn bị click 1 lần...");
            targetBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
                if (isRunning) doMultipleClicks(targetBtn, 1);
            }, 500);
            return true;
        }
        return false;
    }

    function startAutoLoop() {
        if (!isRunning) return;

        const found = findAndClickButton();

        if (!found) {
            checkInstructions();
            setTimeout(startAutoLoop, 2000);
        } else {
            setTimeout(startAutoLoop, 10000);
        }
    }
})();
