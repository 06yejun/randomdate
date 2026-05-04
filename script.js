// 1. 지하철 데이터
const subwayData = {
    "1호선": { start: "연천역", max: 98 }, "2호선": { start: "시청역(내선)", max: 51 },
    "3호선": { start: "대화역", max: 44 }, "4호선": { start: "진접역", max: 51 },
    "5호선": { start: "방화역", max: 56 }, "6호선": { start: "응암역", max: 39 },
    "7호선": { start: "장암역", max: 53 }, "8호선": { start: "암사역", max: 24 },
    "9호선": { start: "개화역", max: 38 }, "서해선": { start: "일산역", max: 21 },
    "인천 1호선": { start: "계양역", max: 30 }, "인천 2호선": { start: "검단오류역", max: 27 }
};

// 2. 카테고리 데이터 모음
const foodCategories = ["한식 🍚", "일식 🍣", "중식 🍜", "양식 🍝", "분식 🍢", "고기 🥩", "패스트푸드 🍔"];
const playCategories = ["보드게임 카페 🎲", "방탈출 카페 🔐", "신나는 오락실 🕹️", "PC방 데이트 🖥️", "만화카페 📚", "코인노래방 🎤", "볼링장/당구장 🎳"];
const cafeCategories = ["분위기 좋은 개인 카페 ☕", "대형 프랜차이즈 🏢", "달콤한 디저트 맛집 🍰", "유명 베이커리/빵지순례 🥐"];
const photoBrands = ["인생네컷 📸", "포토이즘 📸", "하루필름 📸", "포토그레이 📸", "모노맨션 📸", "포토시그니처 📸", "돈룩업 📸"];

const lines = Object.keys(subwayData);

// 기회 관리 상태 변수 (항목이 하나 늘었으므로 play 추가)
let redrawChances = 3;
let drawState = { subway: false, food: false, play: false, cafe: false, photo: false };

// 공통 그리기 함수
function handleDraw(type, btnId, boxId, resultId, logicCallback) {
    const btn = document.getElementById(btnId);
    const box = document.getElementById(boxId);
    const resultText = document.getElementById(resultId);

    // 다시 뽑기 로직 검사
    if (drawState[type]) {
        if (redrawChances > 0) {
            redrawChances--;
            document.getElementById('chance-num').innerText = redrawChances;
            if(redrawChances === 0) {
                document.getElementById('chance-num').style.color = 'black';
            }
        } else {
            alert("앗! 다시 뽑기 기회를 모두 사용했습니다. 이제 운명을 받아들이세요! 😇");
            return;
        }
    }
    
    drawState[type] = true;
    
    btn.disabled = true;
    btn.innerText = "운명 결정 중...";
    resultText.style.color = "#999";

    let timePassed = 0;
    const intervalId = setInterval(() => {
        resultText.innerHTML = "두구두구... 🎲";
        timePassed += 50;

        if (timePassed >= 1500) {
            clearInterval(intervalId);
            logicCallback(resultText);
            
            btn.disabled = false;
            btn.innerText = "다시 뽑기 (기회 차감)";
            resultText.style.color = "#333";
            box.style.borderColor = window.getComputedStyle(btn).backgroundColor;
        }
    }, 50);
}

// 1. 지하철 뽑기
document.getElementById('subway-btn').addEventListener('click', () => {
    handleDraw('subway', 'subway-btn', 'subway-box', 'subway-result', (resultEl) => {
        const line = lines[Math.floor(Math.random() * lines.length)];
        const info = subwayData[line];
        const station = Math.floor(Math.random() * info.max) + 1;
        resultEl.innerHTML = `<span style="color:#007bff">${line}</span><br><strong>${info.start} 방향 ${station}번째 역</strong>`;
    });
});

// 2. 음식 뽑기
document.getElementById('food-btn').addEventListener('click', () => {
    handleDraw('food', 'food-btn', 'food-box', 'food-result', (resultEl) => {
        const food = foodCategories[Math.floor(Math.random() * foodCategories.length)];
        const restNum = Math.floor(Math.random() * 5) + 1;
        const foodNameOnly = food.split(' ')[0];
        resultEl.innerHTML = `검색어: <strong>"도착역 + ${foodNameOnly}"</strong><br>위에서 <strong>${restNum}번째</strong> 식당 가기! ${food.split(' ')[1]}`;
    });
});

// 3. 놀거리 뽑기 (수정됨)
document.getElementById('play-btn').addEventListener('click', () => {
    handleDraw('play', 'play-btn', 'play-box', 'play-result', (resultEl) => {
        const play = playCategories[Math.floor(Math.random() * playCategories.length)];
        // N번째 장소 제거하고 가장 가까운 곳으로 변경
        resultEl.innerHTML = `식사 후엔 <strong>${play}</strong><br>가장 가까운 곳 검색해서 찾아가기!`;
    });
});

// 4. 카페 뽑기
document.getElementById('cafe-btn').addEventListener('click', () => {
    handleDraw('cafe', 'cafe-btn', 'cafe-box', 'cafe-result', (resultEl) => {
        const cafe = cafeCategories[Math.floor(Math.random() * cafeCategories.length)];
        const cafeNum = Math.floor(Math.random() * 3) + 1;
        resultEl.innerHTML = `잠시 쉬어가는 <strong>${cafe}</strong><br>지도 검색 후 <strong>${cafeNum}번째</strong> 장소로 이동!`;
    });
});

// 5. 사진관 뽑기
document.getElementById('photo-btn').addEventListener('click', () => {
    handleDraw('photo', 'photo-btn', 'photo-box', 'photo-result', (resultEl) => {
        const photo = photoBrands[Math.floor(Math.random() * photoBrands.length)];
        resultEl.innerHTML = `오늘의 네컷 사진은 <strong>${photo}</strong><br>가장 가까운 지점 검색해서 찾아가기!`;
    });
});