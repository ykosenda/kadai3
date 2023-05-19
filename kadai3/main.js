/***********************************************
  グローバル変数の設定
************************************************/

// カードの山を配列構造で設定
let cards = [];

// 自分のカードを配列構造で設定
let myCards = [];

// 相手のカードを配列構造で設定
let comCards = [];

// 勝敗決定フラグを論理型で指定？
let isGameOver = false;

/***********************************************
  イベントハンドラの割り当て定義
************************************************/

// ページの読み込みが完了したとき実行する関数を登録
window.addEventListener("load", loadHandler);

// 「カードを引く」ボタンを押したとき実行する関数を登録
document.querySelector("#pick").addEventListener("click", clickPickHandler);

// 「勝負する！」ボタンを押したとき実行する関数を登録
document.querySelector("#judge").addEventListener("click", clickJudgeHandler);

// 「もう1回遊ぶ」ボタンを押したとき実行する関数を登録
document.querySelector("#reset").addEventListener("click", clickResetHandler);

/***********************************************
  イベントハンドラ
************************************************/

// ページの読み込みが完了したとき実行する関数
function loadHandler() {
  // シャッフル
  shuffle();
  // 自分がカードを引く
  pickMyCard();
  // 相手がカードを引く
  pickComCard();
  // 画面を更新する
  updateView();
}

// 「カードを引く」ボタンを押したとき実行する関数定義
function clickPickHandler() {
  // 勝敗が未決定の場合
  if (isGameOver == false) {
    // 自分がカードを引く
    pickMyCard();
    // 相手がカードを引く
    pickComCard();
    // 画面を更新する
    updateView();
  }
}

// 「勝負する！」ボタンを押したとき実行する関数定義
function clickJudgeHandler() {
  let result = "";
  // 勝敗が未決定の場合
  if (isGameOver == false) {
    // 勝敗を判定する
    result = judge();
    // 勝敗を画面に表示する
    showResult(result);
    // 勝敗決定フラグを「決定」に変更
    isGameOver = true;
  }
}

// 「もう1回遊ぶ」ボタンを押したとき実行する関数
function clickResetHandler() {
  // 画面を初期表示に戻す
  // reloadメソッドでページを再読み込みする
  location.reload();
}

/***********************************************
  ゲーム関数の定義
************************************************/

// カードの山をシャッフルする関数
function shuffle() {
  // カードの初期化
  for (let i = 1; i <= 52; i++) {
    cards.push(i);
  }
  // 100回繰り返す
  for (let i = 0; i < 100; i++) {
    // カードの山からランダムに選んだ2枚を入れ替える
    let j = Math.floor(Math.random() * 52);
    let k = Math.floor(Math.random() * 52);
    let temp = cards[j];
    cards[j] = cards[k];
    cards[k] = temp;
  }
}

// 自分がカードを引く関数
function pickMyCard() {
  // 自分のカードの枚数が4枚以下の場合
  if (myCards.length <= 4) {
    // カードの山（配列）から1枚取り出す
    let card = cards.pop();
    // 取り出した1枚を自分のカード（配列）に追加する
    myCards.push(card);
  }
}

// 相手がカードを引く関数
function pickComCard() {
  // 相手のカードの枚数が4枚以下の場合
  if (comCards.length <= 4) {
    // カードを引くかどうか考える
    if (pickAI(comCards)) {
      // カードの山（配列）から1枚取り出す
      let card = cards.pop();
      // 取り出した1枚を相手のカード（配列）に追加する
      comCards.push(card);
    }
  }
}

// カードを引くかどうか考える関数
function pickAI(handCards) {
  // 現在のカードの合計を求める
  let total = getTotal(handCards);
  // カードを引くかどうか
  let isPick = false;

  // 合計が11以下なら「引く」
  if (total <= 11) {
    isPick = true;
  }
  // 合計が12～14なら80%の確率で「引く」
  else if (total >= 12 && total <= 14) {
    if (Math.random() < 0.8) {
      isPick = true;
    }
  }
  // 合計が15～17なら35%の確率で「引く」
  else if (total >= 15 && total <= 17) {
    if (Math.random() < 0.35) {
      isPick = true;
    }
  }
  // 合計が18以上なら「引かない」
  else if (total >= 18) {
    isPick = false;
  }
  // 引くか引かないかを戻り値で返す
  return isPick;
}

// カードの合計を計算する関数
function getTotal(handCards) {
  let total = 0; // 計算した合計を入れる変数
  let number = 0; // カードの数字を入れる変数
  for (let i = 0; i < handCards.length; i++) {
    // 13で割った余りを求める
    number = handCards[i] % 13;
    // J,Q,K（余りが11,12,0）のカードは10と数える
    if (number == 11 || number == 12 || number == 0) {
      total += 10;
    } else {
      total += number;
    }
  }
  // 「A」のカードを含んでいる場合
  if (
    handCards.includes(1) ||
    handCards.includes(14) ||
    handCards.includes(27) ||
    handCards.includes(40)
  ) {
    // 「A」を11と数えても合計が21を超えなければ11と数える
    if (total + 10 <= 21) {
      total += 10;
    }
  }
  // 合計を返す
  return total;
}

// 画面の表示を更新する関数
function updateView() {
  // 自分のカードを表示する
  let myFields = document.querySelectorAll(".myCard");
  for (let i = 0; i < myFields.length; i++) {
    // 自分のカードの枚数がiより大きい場合
    if (i < myCards.length) {
      // 表面の画像を表示する
      myFields[i].setAttribute("src", getCardPath(myCards[i]));
    } else {
      // 裏面の画像を表示する
      myFields[i].setAttribute("src", "blue.png");
    }
  }
  // 相手のカードを表示する
  let comFields = document.querySelectorAll(".comCard");
  for (let i = 0; i < comFields.length; i++) {
    // 相手のカードの枚数がiより大きい場合
    if (i < comCards.length) {
      // 表面の画像を表示する
      comFields[i].setAttribute("src", getCardPath(comCards[i]));
    } else {
      // 裏面の画像を表示する
      comFields[i].setAttribute("src", "red.png");
    }
  }
  // カードの合計を再計算する
  document.querySelector("#myTotal").innerText = getTotal(myCards);
  document.querySelector("#comTotal").innerText = getTotal(comCards);
}

// カードの画像パスを求める関数
function getCardPath(card) {
  // カードのパスを入れる変数
  let path = "";
  // カードの数字が1桁なら先頭にゼロをつける
  if (card <= 9) {
    path = "0" + card + ".png";
  } else {
    path = card + ".png";
  }
  // カードのパスを返す
  return path;
}

// 勝敗を判定する関数
function judge() {
  // 勝敗をあらわす変数
  let result = "";
  // 自分のカードの合計を求める
  let myTotal = getTotal(myCards);
  // 相手のカードの合計を求める
  let comTotal = getTotal(comCards);
  // 勝敗のパターン表に当てはめて勝敗を決める
  if (myTotal > 21 && comTotal <= 21) {
    // 自分の合計が21を超えていれば負け
    result = "loose";
  } else if (myTotal <= 21 && comTotal > 21) {
    // 相手の合計が21を超えていれば勝ち
    result = "win";
  } else if (myTotal > 21 && comTotal > 21) {
    // 自分も相手も21を超えていれば引き分け
    result = "draw";
  } else {
    // 自分も相手も21を超えていない場合
    if (myTotal > comTotal) {
      // 自分の合計が相手の合計より大きければ勝ち
      result = "win";
    } else if (myTotal < comTotal) {
      // 自分の合計が相手の合計より小さければ負け
      result = "loose";
    } else {
      // 自分の合計が相手の合計と同じなら引き分け
      result = "draw";
    }
  }
  // 勝敗を呼び出し元に返す
  return result;
}

// 勝敗を画面に表示する関数
function showResult(result) {
  // メッセージを入れる変数
  let message = "";
  // 勝敗に応じてメッセージを決める
  switch (result) {
    case "win":
      message = "あなたの勝ちです！";
      resultImg = "./img/smile.png";
      break;
    case "loose":
      message = "あなたの負けです！";
      resultImg = "./img/lose.png";
      break;
    case "draw":
      message = "引き分けです！";
      resultImg = "./img/drow.png";
      break;
  }
  //メッセージをともに画像を結果画像を表示させるには。画像のqueryselector?
  switch (resultImg) {
    case "win":
      resultImg = "./img/smile.png";
      break;
    case "loose":
      resultImg = "./img/lose.png";
      break;
    case "draw":
      resultImg = "./img/drow.png";
      break;
  }
  // メッセージを表示する
  document.querySelector("#final-result").style.color = "green";
  document.querySelector("#final-result").textContent += message;
  alert(message);
}

/***********************************************
  デバッグ関数
************************************************/

// グローバル変数をコンソールに出力する関数
function debug() {
  console.log("カードの山", cards);
  console.log("自分のカード", myCards, "合計" + getTotal(myCards));
  console.log("相手のカード", comCards, "合計" + getTotal(comCards));
  console.log("勝敗決定フラグ", isGameOver);
}
