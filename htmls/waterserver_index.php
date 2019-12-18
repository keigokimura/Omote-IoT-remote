<!DOCTYPE html>
<html>
<head>
    <title>水道管理アプリ</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <script src="https://code.jquery.com/jquery-3.4.0.min.js"></script>
    <link href="../css/server.css" rel="stylesheet">
    <script src="../js/bootstrap.bundle.js"></script>
    <link href="../css/bootstrap.css" rel="stylesheet">
    <link href="../styles/waterserver_index.css" rel="stylesheet">
    <script src="../scripts/serverindex.js"></script>
    <link href="../styles/common.css" rel="stylesheet">
    <script src="../scripts/common.js"></script>
</head>
<body>
<header>
    <nav class="navbar navbar-expand-md">
        <div class="px-5">
            <a class="navbar-brand" href="/"><img
                        src="../images/omotekensuido.png" alt="面研水道"></a>
        </div>
        <button type="button" class="navbar-toggler" data-toggle="collapse"
                data-target="#bs-navi" aria-controls="bs-navi" aria-expanded="false"
                aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="bs-navi">
            <ul class="navbar-nav ml-auto"></ul>
            <ul class="navbar-nav mr-5">
                <div class="px-4 h5">
                    <li class="nav-item" style="border-bottom: 1.5px solid #f5f5f5"><a
                                class="nav-link" href="../..">ホーム</a></li>
                </div>
                <div class="px-4 h5">
                    <li class="nav-item" style="border-bottom: 1.5px solid #f5f5f5"><a
                                class="nav-link" href="#">使い方</a></li>
                </div>
                <div class="px-4 h5">
                    <li class="nav-item" style="border-bottom: 1.5px solid #f5f5f5"><a
                                class="nav-link" href="../htmls/information_confirm.php">登録情報</a></li>
                </div>
                <div class="px-4 h5">
                    <li class="nav-item" style="border-bottom: 1.5px solid #f5f5f5"><a
                                class="nav-link" href="../htmls/charge.html">入金</a></li>
                </div>
            </ul>
        </div>
    </nav>
</header>
<div class="main">
    <div class="mx-auto" style="width: 600px;">
        <div id="networkid"></div>
        <div id="accounts"></div>
        <br>
        <h2>個人情報登録フォーム</h2>
        <h2>登録情報を入力してください</h2>

        <div class="border rounded">
            <div class="userdata form-group">
                <form method="POST" action="regist_confirm.php">
                    <label class="mt-4">名前：</label><br>
                    <input type="text" name="lastname" class="lastname form-control" required>
                    <input type="text" name="firstname" class="firstname form-control" required><br>
                    <label class="mt-4">電話番号：</label><br>
                    <input type="text" name="tel" class="tel form-control" required><br>
                    <label class="mt-4">住所：</label><br>
                    <input type="text" name="address" class="address form-control" required><br>
                    <label class="mt-4">メールアドレス：</label><br>
                    <input type="text" name="mail" class="mail form-control" required><br>
                    <label class="mt-4">ethのアカウント：</label><br>
                    <input type="text" name="eth" class="eth form-control" required><br>
                    <div class="conf-button">
                        <button type="submit" name="submit" class="btn btn-primary">確認</button>
                        <br>
                    </div>
                </form>
            </div>
        </div>

        <a href="../index.html">使用量確認ページはこちら</a>
        <footer>
            <div class="bottom section-padding">
                <div class="container">
                    <div class="row">
                        <div class="col-3 mx-auto">
                            <a class="navbar-brand"
                               href="http://www.risk.tsukuba.ac.jp/omote-lab/"><img
                                        src="../images/omotelab-tsukuba-2.png" class="img-fluid"
                                        alt="omotelab"></a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
</body>
</html>
