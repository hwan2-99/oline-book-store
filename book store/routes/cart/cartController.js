var express = require("express");
const pool = require("../../config/dbConfig");
var router = express.Router();
const cartService = require("./cartService");
const session = require("express-session");
const { query } = require("../../config/dbConfig");
const FileStore = require("session-file-store")(session);

// 장바구니 책 조회
router.get("/cart_list", async function (req, res) {
  let cart_total = 0;
  const is_logined = req.session.user_num === undefined ? false : true;
  const result = await cartService.getCartBook(req.session.user_num); //책 리스트 전달

  for (let index = 0; index < result.length; index++) {
    cart_total += result[index].book_price;
  }
  await cartService.plusCart(cart_total, req.session.user_num);
  return res.render("cart/cart_list", {
    is_logined,
    result: result,
  });
});

// 장바구니 책 등록 ( 장바구니 번호와 책번호 요청)
router.post("/cart/book_add", async function (req, res) {
  console.log(req.body);
  try {
    if (req.body) {
      try {
        if (req.body) {
          const result = await cartService.addCart(
            req.session.user_num,
            req.body.book_num
          );
          res.send(`<script type="text/javascript">alert("등록이 완료되었습니다!");
                  document.location.href="/";</script>`);
        }
      } catch (error) {
        res.redirect("/book/book-main");
      }
    }
  } catch (error) {
    res.redirect("/book/book-main");
  }
});

// 장바구니 책 삭제 ( 장바구니 번호와 책번호 요청)
router.get("/cart/book_delete", async function (req, res) {
  try {
    if (req.query) {
      const result = await cartService.deleteCartBook(req.query.cart_num);
      res.send(`<script type="text/javascript">alert("장바구니에서 책 삭제가 완료되었습니다!");
              document.location.href="/cart/cart_list";</script>`);
    }
  } catch (error) {
    res.redirect("/book/addBook");
  }
});

module.exports = router;
