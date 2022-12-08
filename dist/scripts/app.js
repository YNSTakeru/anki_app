"use strict";
class Task {
    constructor() {
        this._$taskAddBtn = document.querySelector(".taskAddBtn");
        this._$coverGray = document.querySelector(".cover__gray");
        this._$decision = document.querySelector(".decision");
        this._$tasks = document.querySelector(".tasks");
        this._$textWrapperFlex = document.querySelector(".text__wrapper__flex");
        this._$x = document.querySelector(".x");
        this._$problemTextarea = document.querySelector(".problem__textarea");
        this._$answerTextarea = document.querySelector(".answer__textarea");
        this._$createCard = document.querySelector(".create__card");
        this._$detailCard = document.querySelector(".detail__card");
        this._$detailCardContents = document.querySelector(".detail__card .contents");
        this._$answerBtn = document.querySelector(".answer__Btn");
        this._$rememberedBtn = document.querySelector(".remembered__Btn");
        this._$forgetBtn = document.querySelector(".forget__Btn");
        this._$editBtn = document.querySelector(".edit");
        this._$removeBtn = document.querySelector(".remove");
        this._problemValue = "";
        this._originProblemValue = "";
        this._answerValue = "";
        this._originAnswerValue = "";
        this._cardObjs = {};
        this._cardObjCount = 1;
        this._key = "";
        this._rememberedState = [1, 7, 14, 30, 60, 120, 240];
        this._keys = [];
        this._$taskAddBtn.addEventListener("click", this._openNewText.bind(this));
        this._getData();
        this._popUpCard();
        this._$coverGray.addEventListener("click", this._closeCard.bind(this));
        this._$decision.addEventListener("click", this._createOrUpdate.bind(this));
        this._$x.addEventListener("click", this._closeCard.bind(this));
        this._$problemTextarea.addEventListener("input", this._setTextValue.bind(this));
        this._$answerTextarea.addEventListener("input", this._setTextValue.bind(this));
        this._$answerBtn.addEventListener("click", () => {
            const objKey = this._$detailCardContents.innerHTML;
            this._$editBtn.classList.remove("off");
            this._key = objKey;
            if (objKey !== null) {
                this._$detailCardContents.innerHTML =
                    this._cardObjs[objKey].answer;
                this._$detailCardContents.innerHTML = `<div class="base__line__height">${objKey}</div><div class="base__line__height">${this._cardObjs[objKey].answer}</div>`;
            }
            this._$answerBtn.classList.add("off");
            this._$rememberedBtn.classList.remove("off");
            this._$forgetBtn.classList.remove("off");
        });
        this._$rememberedBtn.addEventListener("click", () => {
            this._cardObjs[this._key].state = "remembered";
            this._cardObjs[this._key].rememberedCount++;
            this._$chosenCard.querySelector("svg").classList.add("on");
            const p = Promise.resolve();
            p.then(() => {
                localStorage.setItem(this._key, JSON.stringify(this._cardObjs[this._key]));
            });
            this._closeCard();
        });
        this._$forgetBtn.addEventListener("click", () => {
            this._cardObjs[this._key].state = "forgot";
            this._cardObjs[this._key].rememberedCount = 0;
            this._cardObjs[this._key].dt = new Date();
            if (this._$chosenCard.querySelector("svg").classList.contains("on"))
                this._$chosenCard.querySelector("svg").classList.remove("on");
            const p = Promise.resolve();
            p.then(() => {
                localStorage.setItem(this._key, JSON.stringify(this._cardObjs[this._key]));
            });
            this._closeCard();
        });
        this._$editBtn.addEventListener("click", () => {
            this._$detailCard.classList.add("off");
            this._$createCard.classList.remove("off");
            if (document
                .querySelector(".textarea__container")
                .classList.contains("off")) {
                document
                    .querySelector(".textarea__container")
                    .classList.remove("off");
            }
            this._$problemTextarea.value =
                this._cardObjs[this._key].originProblem;
            this._cardObjs[this._key].originProblem;
            this._$answerTextarea.value =
                this._cardObjs[this._key].originAnswer;
            this._$decision.textContent = "編集を保存";
        });
        this._$removeBtn.addEventListener("click", () => {
            const objKey = this._$detailCardContents.innerHTML;
            this._key = objKey;
            this._removeData(this._cardObjs, this._key);
            this._closeCard();
            delete this._cardObjs[this._key];
            this._$tasks.removeChild(this._$chosenCard);
            this._cleartext();
        });
    }
    _popUpCard() {
        const p = Promise.resolve();
        p.then(() => {
            setInterval(() => {
                this._keys = Object.keys(this._cardObjs);
                this._keys.forEach((v) => {
                    this._checkedMark(this._cardObjs[v], v);
                });
            }, 1000);
        });
    }
    _getData() {
        const p = Promise.resolve();
        p.then(() => {
            const arry = localStorage.getItem("KEYS");
            if (arry) {
                JSON.parse(arry).forEach((v) => {
                    const p2 = Promise.resolve();
                    p2.then(() => {
                        const obj = JSON.parse(localStorage.getItem(v));
                        this._readCard(obj, v);
                    });
                });
            }
        });
    }
    _setTextValue({ target }) {
        if (!(target instanceof HTMLTextAreaElement))
            return;
        if (target.classList.contains("problem__textarea")) {
            this._problemValue = this._changeBr(target.value);
            this._originProblemValue = target.value;
        }
        if (target.classList.contains("answer__textarea")) {
            this._answerValue = this._changeBr(target.value);
            this._originAnswerValue = target.value;
        }
    }
    _changeBr(value) {
        const text = value;
        const textArray = text.split("\n");
        const newText = textArray.join("<br>");
        return newText;
    }
    _openCard() {
        if (this._$coverGray.classList.contains("on"))
            return;
        this._$coverGray.classList.add("on");
        this._$textWrapperFlex.classList.add("on");
    }
    _openNewText() {
        this._openCard();
        this._$decision.textContent = "カードを追加";
        if (!this._$editBtn.classList.contains("off")) {
            this._$removeBtn.classList.add("off");
        }
        if (this._$createCard.classList.contains("off"))
            this._$createCard.classList.remove("off");
        if (!this._$detailCard.classList.contains("off"))
            this._$detailCard.classList.add("off");
    }
    _closeCard() {
        this._$coverGray.classList.remove("on");
        if (document
            .querySelector(".textarea__container")
            .classList.contains("off")) {
            document
                .querySelector(".textarea__container")
                .classList.remove("off");
        }
        this._$textWrapperFlex.classList.remove("on");
        if (!this._$detailCard.classList.contains("off")) {
            this._$detailCard.classList.add("off");
            if (!this._$removeBtn.classList.contains("off"))
                this._$removeBtn.classList.add("off");
            if (!this._$editBtn.classList.contains("off"))
                this._$editBtn.classList.add("off");
        }
        if (!this._$createCard.classList.contains("off")) {
            this._$createCard.classList.add("off");
            this._$editBtn.classList.add("off");
            this._$removeBtn.classList.add("off");
            if (!this._$editBtn.classList.contains("off")) {
                this._$editBtn.classList.add("off");
            }
        }
    }
    _createOrUpdate() {
        if (!this._$editBtn.classList.contains("off")) {
            this._editSave();
        }
        else {
            this._addTask();
        }
    }
    _editSave() {
        this._$createCard.classList.add("off");
        this._$detailCard.classList.remove("off");
        if (!document
            .querySelector(".textarea__container")
            .classList.contains("off")) {
            document
                .querySelector(".textarea__container")
                .classList.add("off");
        }
        const id = this._cardObjs[this._key].id;
        const arry = this._keys.map((v) => {
            if (v == `${this._key}`) {
                return this._changeBr(this._$problemTextarea.value);
            }
            return v;
        });
        this._updateKeys(arry);
        delete this._cardObjs[this._key];
        const preKey = `${this._key}`;
        this._key = this._changeBr(this._$problemTextarea.value);
        this._cardObjs = Object.assign(this._cardObjs, {
            [this._key]: {
                id: +id,
                answer: this._changeBr(this._$answerTextarea.value),
                originProblem: this._$problemTextarea.value,
                originAnswer: this._$answerTextarea.value,
            },
        });
        const p = Promise.resolve();
        p.then(() => {
            localStorage.removeItem(preKey);
            localStorage.setItem(`${this._key}`, JSON.stringify(this._cardObjs[this._key]));
        });
        this._$chosenCard.innerHTML = this._key;
        this._$chosenCard.dataset.answer = this._cardObjs[this._key].answer;
        const _$dom = document.querySelectorAll(".base__line__height");
        let [_$problem, _$answer] = [..._$dom];
        _$problem.innerHTML = this._key;
        _$answer.innerHTML = this._cardObjs[this._key].answer;
    }
    _removeData(obj, key) {
        const p = Promise.resolve();
        console.log(obj, key);
        p.then(() => {
            localStorage.setItem("KEYS", JSON.stringify(Object.keys(obj).filter((v) => {
                return v !== key;
            })));
            localStorage.removeItem(key);
        });
    }
    _setData(obj, key) {
        const p = Promise.resolve();
        p.then(() => {
            if (!key) {
                localStorage.setItem("KEYS", JSON.stringify(Object.keys(obj)));
                Object.keys(obj).forEach((v) => {
                    localStorage.setItem(v, JSON.stringify(obj[v]));
                });
            }
            if (key) {
                localStorage.setItem(key, JSON.stringify(obj[key]));
            }
        });
    }
    _checkedMark(obj, key) {
        const now = new Date();
        const target = new Date(obj.dt);
        target.setDate(target.getDate() + this._rememberedState[obj.rememberedCount]);
        if (now.getTime() >= target.getTime()) {
            const $dom = document.querySelector(`.${key}`)
                .previousElementSibling;
            $dom.classList.contains("on") ? $dom.classList.remove("on") : "";
            const $tmpDom = $dom.parentElement.firstChild.nextSibling;
            $dom.parentElement.insertBefore($dom, $tmpDom);
        }
        else {
            if (obj.state === "remembered") {
                const $dom = document.querySelector(`.${key}`)
                    .previousElementSibling;
                $dom.classList.add("on");
            }
        }
    }
    _readCard(obj, key) {
        const _$card = document.createElement("li");
        _$card.classList.add("card");
        _$card.innerHTML = `<svg 
        width="30"
        height="30"
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg><div class="${key}">${key}</div>`;
        _$card.dataset.answer = obj.answer;
        this._$tasks.appendChild(_$card);
        this._checkedMark(obj, key);
        _$card.id = obj.id.toString();
        this._cardObjs = Object.assign(this._cardObjs, {
            [key]: {
                id: obj.id,
                answer: obj.answer,
                originProblem: obj.originProblem,
                originAnswer: obj.originAnswer,
                rememberedCount: obj.rememberedCount,
                dt: obj.dt,
            },
        });
        this._cardObjCount++;
        _$card.addEventListener("click", this._openDetailCard.bind(this, _$card));
        _$card.draggable = true;
        _$card.addEventListener("dragstart", this._onDragStart.bind(this));
        _$card.addEventListener("dragover", this._onDragOver.bind(this));
        _$card.addEventListener("drop", this._onDrop.bind(this));
    }
    _addTask() {
        if (this._cardObjs[this._problemValue]) {
            alert("もう既に追加されています");
            return;
        }
        this._closeCard();
        const today = new Date();
        const obj = {
            id: +this._cardObjCount,
            answer: this._answerValue,
            originProblem: this._originProblemValue,
            originAnswer: this._originAnswerValue,
            state: "forgot",
            rememberedCount: 0,
            dt: today,
        };
        const key = this._problemValue;
        this._readCard(obj, key);
        this._setData(this._cardObjs);
        this._cleartext();
    }
    _openDetailCard(_$card) {
        this._openCard();
        this._$chosenCard = _$card;
        if (!document
            .querySelector(".textarea__container")
            .classList.contains("off")) {
            document
                .querySelector(".textarea__container")
                .classList.add("off");
        }
        if (this._$answerBtn.classList.contains("off")) {
            this._$answerBtn.classList.remove("off");
        }
        if (!this._$forgetBtn.classList.contains("off")) {
            this._$rememberedBtn.classList.add("off");
            this._$forgetBtn.classList.add("off");
        }
        this._$removeBtn.classList.remove("off");
        if (_$card.querySelector("div")) {
            this._$detailCardContents.innerHTML =
                _$card.querySelector("div").innerHTML;
        }
        else {
            this._$detailCardContents.innerHTML = _$card.innerHTML;
        }
        const objKey = this._$detailCardContents.innerHTML;
        this._key = objKey;
        if (!this._$createCard.classList.contains("off"))
            this._$createCard.classList.add("off");
        if (this._$detailCard.classList.contains("off"))
            this._$detailCard.classList.remove("off");
    }
    _cleartext() {
        this._$problemTextarea.value = "";
        this._$answerTextarea.value = "";
        this._problemValue = "";
        this._answerValue = "";
    }
    _onDragStart(e) {
        const dataTransfer = e.dataTransfer;
        dataTransfer.effectAllowed = "move";
        if (e.target instanceof HTMLElement) {
            dataTransfer.setData("text", e.target.id);
        }
    }
    _onDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    }
    _updateKeys(keys) {
        const p = Promise.resolve();
        p.then(() => {
            localStorage.setItem("KEYS", JSON.stringify(keys));
        });
    }
    _onDrop(e) {
        var _a, _b, _c, _d, _e, _f;
        if (e.stopPropagation)
            e.stopPropagation();
        const eid = (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData("text");
        const $dom = document.getElementById(eid);
        if (e.target instanceof HTMLElement) {
            if (((_c = (_b = $dom.previousElementSibling) === null || _b === void 0 ? void 0 : _b.querySelector("button")) === null || _c === void 0 ? void 0 : _c.textContent) === "カードの追加") {
                if (!e.target.nextElementSibling) {
                    (_d = e.target.parentElement) === null || _d === void 0 ? void 0 : _d.appendChild($dom);
                    const targetKey = $dom.querySelector("div").textContent;
                    const arry = this._keys.filter((key) => {
                        if (key == targetKey) {
                            return false;
                        }
                        return true;
                    });
                    this._updateKeys([...arry, `${targetKey}`]);
                }
                else {
                    const deleteTarget = $dom.querySelector("div").textContent;
                    const addTarget = $dom.querySelector("div").textContent;
                    const deleteNum = this._keys.lastIndexOf(`${deleteTarget}`);
                    const arry = this._keys.filter((key) => {
                        return key != deleteTarget;
                    });
                    arry.splice(deleteNum + 1, 0, `${addTarget}`);
                    this._updateKeys(arry);
                    this._keys = arry;
                    e.target.parentElement.insertBefore($dom, e.target.nextSibling);
                }
            }
            else {
                const $doms = document.querySelectorAll(".tasks li");
                let aNum = 0;
                let bNum = 0;
                for (let i = 1; i < $doms.length; i++) {
                    const $tDom = $doms[i].querySelector("div").textContent;
                    if ($tDom == ((_e = $dom.querySelector("div")) === null || _e === void 0 ? void 0 : _e.textContent)) {
                        aNum = i - 1;
                    }
                    if ($tDom == ((_f = e.target.querySelector("div")) === null || _f === void 0 ? void 0 : _f.textContent)) {
                        bNum = i - 1;
                    }
                }
                if (bNum < aNum) {
                    e.target.parentElement.insertBefore($dom, e.target);
                    const arry = this._keys;
                    arry.splice(bNum, 1, `${$dom.querySelector("div").textContent}`);
                    arry.splice(aNum, 1, `${e.target.querySelector("div").textContent}`);
                    this._updateKeys(arry);
                    this._keys = arry;
                }
                else {
                    e.target.parentElement.insertBefore(e.target, $dom);
                    const arry = this._keys;
                    arry.splice(bNum, 1, `${$dom.querySelector("div").textContent}`);
                    arry.splice(aNum, 1, `${e.target.querySelector("div").textContent}`);
                    this._updateKeys(arry);
                    this._keys = arry;
                }
            }
        }
    }
}
const task = new Task();
//# sourceMappingURL=app.js.map