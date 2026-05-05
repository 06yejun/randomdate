// 1. 지하철 데이터 (양방향 종점 추가, 2호선은 신도림 기준)
const subwayData = {
    "1호선": { terminals: ["연천역", "인천역"], max: 98 },
    "2호선": { reference: "신도림역", max: 43 },
    "3호선": { terminals: ["대화역", "오금역"], max: 44 },
    "4호선": { terminals: ["진접역", "오이도역"], max: 51 },
    "5호선": { terminals: ["방화역", "하남검단산역"], max: 56 }, 
    "6호선": { terminals: ["응암역", "신내역"], max: 39 },
    "7호선": { terminals: ["장암역", "석남역"], max: 53 },
    "8호선": { terminals: ["암사역", "모란역"], max: 24 },
    "9호선": { terminals: ["개화역", "중앙보훈병원역"], max: 38 }
};

// 2. 카테고리 데이터 모음 (놀거리 항목 추가 반영)
const foodCategories = ["한식 🍚", "일식 🍣", "중식 🍜", "양식 🍝", "분식 🍢", "고기 🥩", "패스트푸드 🍔"];
const playCategories = ["보드게임 카페 🎲", "방탈출 카페 🔐", "신나는 오락실 🕹️", "PC방 데이트 🖥️", "만화카페 📚", "코인노래방 🎤", "볼링장 🎳", "당구장 🎱", "스크린 야구장 ⚾", "실내 클라이밍장 🧗", "공방 원데이 클래스 🎨", "조용한 독립서점 📖", "영화관 데이트 🍿"];
const cafeCategories = ["분위기 좋은 개인 카페 ☕", "대형 프랜차이즈 🏢", "달콤한 디저트 맛집 🍰", "유명 베이커리/빵지순례 🥐"];
const photoBrands = ["인생네컷 📸", "포토이즘 📸", "하루필름 📸", "포토그레이 📸", "모노맨션 📸", "포토시그니처 📸", "돈룩업 📸"];

const lines = Object.keys(subwayData);

// 기회 관리 상태 변수
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
            logicCallback(resultText); // 최종 로직 실행
            
            btn.disabled = false;
            btn.innerText = "다시 뽑기 (기회 차감)";
            resultText.style.color = "#333";
            box.style.borderColor = window.getComputedStyle(btn).backgroundColor;
        }
    }, 50);
}

// 1. 지하철 뽑기 (출발점 기준으로 직관적인 안내)
document.getElementById('subway-btn').addEventListener('click', () => {
    handleDraw('subway', 'subway-btn', 'subway-box', 'subway-result', (resultEl) => {
        const line = lines[Math.floor(Math.random() * lines.length)];
        const info = subwayData[line];
        const station = Math.floor(Math.random() * info.max) + 1;
        
        let directionText = "";

        if (line === "2호선") {
            // 2호선: 신도림역에서 출발해 내선/외선 순환
            const circleDir = Math.random() < 0.5 ? "내선순환(시계방향)" : "외선순환(반시계방향)";
            directionText = `${info.reference}에서 출발해<br><strong>${circleDir}으로 ${station}번째 역</strong>`;
        } else {
            // 나머지 호선: 종점 중 하나를 출발역으로, 반대쪽을 방향으로 지정
            const isFirstStart = Math.random() < 0.5;
            const startStation = isFirstStart ? info.terminals[0] : info.terminals[1];
            const endStation = isFirstStart ? info.terminals[1] : info.terminals[0];
            
            directionText = `${startStation}에서 출발해<br><strong>${endStation} 방향으로 ${station}번째 역</strong>`;
        }

        resultEl.innerHTML = `<span style="color:#007bff">${line}</span><br>${directionText}`;
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

// 3. 놀거리 뽑기
document.getElementById('play-btn').addEventListener('click', () => {
    handleDraw('play', 'play-btn', 'play-box', 'play-result', (resultEl) => {
        const play = playCategories[Math.floor(Math.random() * playCategories.length)];
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