import Board from "./board";
import Game from "./game";

document.addEventListener("DOMContentLoaded", function () {
  const stage = new createjs.Stage("canvas");
  const board = new Board(stage);
  window.board = board;
  board.draw();
  stage.update();

  const game = new Game(stage);

  function LhandlePress(e) {
    console.log('Key pressed:', e.keyCode, e.key); // 디버깅용
    
    // ESC 키로 pause
    if (e.keyCode === 27) {
      if (game.started && !game.paused) {
        game.pauseGame();
      } else if (game.paused) {
        game.resumeGame();
      }
      return;
    }
    
    // Single player 모드일 때는 왼쪽 키 무시
    if (game.gameMode === 'single') {
      return;
    }
    
    if (game.started && !game.paused) {
      switch (e.keyCode) {
        case 65: // A 키 (대문자)
        case 97:  // a 키 (소문자)
          game.check(game.LleftArrows, "l_left");
          break;
        case 83: // S 키 (대문자)
        case 115: // s 키 (소문자)
          game.check(game.LdownArrows, "l_down");
          break;
        case 87: // W 키 (대문자)
        case 119: // w 키 (소문자)
          game.check(game.LupArrows, "l_up");
          break;
        case 68: // D 키 (대문자)
        case 100: // d 키 (소문자)
          game.check(game.LrightArrows, "l_right");
          break;
      }
    }
  }

  function RhandlePress(e) {
    console.log('Key pressed:', e.keyCode, e.key); // 디버깅용
    
    if (game.started && !game.paused) {
      switch (e.keyCode) {
        case 74: // J 키 (대문자)
        case 106: // j 키 (소문자)
          game.check(game.RleftArrows, "r_left");
          break;
        case 75: // K 키 (대문자)
        case 107: // k 키 (소문자)
          game.check(game.RdownArrows, "r_down");
          break;
        case 73: // I 키 (대문자)
        case 105: // i 키 (소문자)
          game.check(game.RupArrows, "r_up");
          break;
        case 76: // L 키 (대문자)
        case 108: // l 키 (소문자)
          game.check(game.RrightArrows, "r_right");
          break;
      }
    }
  }

  document.addEventListener("keydown", LhandlePress, false);
  document.addEventListener("keydown", RhandlePress, false);
  
  // 캔버스 클릭 시 YouTube 비디오 시작 (사용자 상호작용)
  const canvas = document.getElementById("canvas");
  if (canvas) {
    canvas.addEventListener("click", function() {
      if (game.youtubePlayer && game.youtubeReady) {
        try {
          const playerState = game.youtubePlayer.getPlayerState();
          if (playerState === YT.PlayerState.UNSTARTED || playerState === YT.PlayerState.PAUSED) {
            game.youtubePlayer.playVideo();
          }
        } catch (error) {
          console.log('YouTube video play attempt on click:', error);
        }
      }
    });
  }
});
