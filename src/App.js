import { useState, useEffect } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

function Card({ children }) {
  return (
    <div style={{
      background: "white",
      padding: "20px",
      borderRadius: "20px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
    }}>
      {children}
    </div>
  );
}

function CardContent({ children }) {
  return <div>{children}</div>;
}

function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "#f472b6",
        border: "none",
        padding: "10px",
        borderRadius: "12px",
        color: "white",
        cursor: "pointer"
      }}
    >
      {children}
    </button>
  );
}

export default function OshikatsuSavingsApp() {
  const [goal, setGoal] = useState(50000);
  const [goalInput, setGoalInput] = useState("");
  const [saved, setSaved] = useState(0);
  const [amount, setAmount] = useState("");
  const [history, setHistory] = useState([]);

  const [wishName, setWishName] = useState("");
  const [wishPrice, setWishPrice] = useState("");
  const [wishlist, setWishlist] = useState([]);

  // データ読み込み（ページを開いたとき）
  useEffect(() => {
    const data = localStorage.getItem("oshikatsu_app_data");
    if (data) {
      const parsed = JSON.parse(data);
      setGoal(parsed.goal ?? 50000);
      setSaved(parsed.saved ?? 0);
      setHistory(parsed.history ?? []);
      setWishlist(parsed.wishlist ?? []);
    }
  }, []);

  // データ保存（状態が変わるたび）
  useEffect(() => {
    const data = {
      goal,
      saved,
      history,
      wishlist,
    };

    localStorage.setItem("oshikatsu_app_data", JSON.stringify(data));
  }, [goal, saved, history, wishlist]);

  function changeGoal() {
    const value = Number(goalInput);
    if (!value || value <= 0) return;
    setGoal(value);
    setGoalInput("");
  }

  function addSaving() {
    const value = Number(amount);
    if (!value || value <= 0) return;

    const newSaved = saved + value;
    setSaved(newSaved);

    setHistory([
      { amount: value, date: new Date().toLocaleDateString("ja-JP") },
      ...history,
    ]);

    setAmount("");
  }

  function addWish() {
    if (!wishName || !wishPrice) return;

    setWishlist([
      ...wishlist,
      {
        name: wishName,
        price: Number(wishPrice),
        bought: false,
      },
    ]);

    setWishName("");
    setWishPrice("");
  }

  function toggleBought(index) {
    const updated = [...wishlist];
    const item = updated[index];

    if (!item.bought) {
      if (saved < item.price) {
        alert("貯金が足りません！");
        return;
      }

      setSaved(saved - item.price);

      setHistory([
        { amount: -item.price, date: new Date().toLocaleDateString("ja-JP") },
        ...history,
      ]);

      item.bought = true;
    } else {
      setSaved(saved + item.price);

      setHistory([
        { amount: item.price, date: new Date().toLocaleDateString("ja-JP") },
        ...history,
      ]);

      item.bought = false;
    }

    setWishlist(updated);
  }

  function removeWish(index) {
    const updated = [...wishlist];
    const item = updated[index];

    // もし購入済みなら貯金を戻す
    if (item.bought) {
      setSaved(saved + item.price);

      setHistory([
        { amount: item.price, date: new Date().toLocaleDateString("ja-JP") },
        ...history,
      ]);
    }

    updated.splice(index, 1);
    setWishlist(updated);
  }

  function removeHistory(index) {
    const updated = [...history];
    updated.splice(index, 1);
    setHistory(updated);
  }
  const progress = Math.min((saved / goal) * 100, 100);

  return (
    <div className="min-h-screen bg-pink-50 p-6 flex justify-center">
      <div className="w-full max-w-md grid gap-6">
        <h1 className="text-3xl font-bold text-center text-pink-500">
          🎀 推し活貯金アプリ 🎀
        </h1>

        <Card className="rounded-3xl shadow-lg border-pink-200 border bg-white">
          <CardContent className="p-5 grid gap-3">
            <h2 className="font-semibold text-pink-500">💰 貯金目標</h2>

            <div className="text-sm">現在の目標: ¥{goal.toLocaleString()}</div>
            <div className="text-sm">現在の貯金: ¥{saved.toLocaleString()}</div>

            <input
              type="number"
              className="border border-pink-200 p-2 rounded-xl"
              placeholder="新しい目標金額 (円)"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
            />

            <Button
              className="bg-pink-300 hover:bg-pink-400 rounded-2xl"
              onClick={changeGoal}
            >
              目標を変更
            </Button>

            <div className="w-full bg-pink-100 rounded-full h-4">
              <div
                className="bg-pink-400 h-4 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="text-xs text-pink-500">達成率 {progress.toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl shadow-lg border-pink-200 border bg-white">
          <CardContent className="p-5 grid gap-3">
            <h2 className="font-semibold text-pink-500">💴 貯金を追加</h2>
            <input
              type="number"
              className="border border-pink-200 p-2 rounded-xl"
              placeholder="金額を入力 (円)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button
              className="bg-pink-400 hover:bg-pink-500 rounded-2xl"
              onClick={addSaving}
            >
              貯金する
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-3xl shadow-lg border-pink-200 border bg-white">
          <CardContent className="p-5 grid gap-3">
            <h2 className="font-semibold text-pink-500">📝 貯金履歴</h2>
            {history.length === 0 ? (
              <div className="text-sm text-gray-500">まだ貯金がありません</div>
            ) : (
              <div className="max-h-40 overflow-y-auto pr-1">
                {history.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center border-b border-pink-100 pb-1"
                  >
                    <span>¥{item.amount.toLocaleString()}</span>
                    <span className="text-xs">{item.date}</span>

                    <Button
                      className="bg-gray-200 hover:bg-gray-300 rounded-2xl"
                      onClick={() => removeHistory(i)}
                    >
                      削除
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-3xl shadow-lg border-pink-200 border bg-white">
          <CardContent className="p-5 grid gap-3">
            <h2 className="font-semibold text-pink-500">🛍 ほしい物リスト</h2>

            <input
              className="border border-pink-200 p-2 rounded-xl"
              placeholder="グッズ名 (例: アクスタ・チケット)"
              value={wishName}
              onChange={(e) => setWishName(e.target.value)}
            />

            <input
              type="number"
              className="border border-pink-200 p-2 rounded-xl"
              placeholder="値段 (円)"
              value={wishPrice}
              onChange={(e) => setWishPrice(e.target.value)}
            />

            <Button
              className="bg-pink-400 hover:bg-pink-500 rounded-2xl"
              onClick={addWish}
            >
              リストに追加
            </Button>

            {wishlist.length === 0 && (
              <div className="text-sm text-gray-500">まだアイテムがありません</div>
            )}

            {wishlist.map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center border-b border-pink-100 pb-2 gap-2"
              >
                <div>
                  <div
                    className={`text-sm ${item.bought ? "line-through text-gray-400" : ""}`}
                  >
                    {item.name}
                  </div>
                  <div className="text-xs">¥{item.price.toLocaleString()}</div>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="bg-pink-300 hover:bg-pink-400 rounded-2xl"
                    onClick={() => toggleBought(i)}
                  >
                    {item.bought ? "購入取り消し" : "購入済み"}
                  </Button>

                  <Button
                    className="bg-gray-200 hover:bg-gray-300 rounded-2xl"
                    onClick={() => removeWish(i)}
                  >
                    削除
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}