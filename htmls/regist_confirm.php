<!DOCTYPE html>
<html>
<head>
    <title>水道管理アプリ</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <script src="https://code.jquery.com/jquery-3.4.0.min.js"></script>
    <link href="../css/server.css" rel="stylesheet">
    <link href="../styles/registpage.css" rel="stylesheet">
    <script src="../js/bootstrap.bundle.js"></script>
    <link href="../css/bootstrap.css" rel="stylesheet">
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
                                class="nav-link" href="#">登録情報</a></li>
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
        <br>
        <h2>登録情報確認フォーム</h2>

        <?php
        //フォームから受け取った値を変数に代入
        //$name=$_POST['firstname'] . $_POST['lastname'];
        $tel=$_POST['tel'];
        $address=$_POST['address'];
        $mail=$_POST['mail'];
        $eth=$_POST['eth'];

        function insert(){
            try{
                // データベースへ接続
                $dbinfo = parse_url(getenv('DATABASE_URL'));
                $dsn = 'pgsql:host=' . $dbinfo['host'] . ';dbname=' . substr($dbinfo['path'], 1);
                $pdo = new PDO($dsn, $dbinfo['user'], $dbinfo['pass']);
            }catch (PDOException $e){
                print('Error:'.$e->getMessage());
                die();
            }

            $name=$_POST['firstname'] . $_POST['lastname'];
            $tel=$_POST['tel'];
            $address=$_POST['address'];
            $mail=$_POST['mail'];
            $eth=$_POST['eth'];

            //データベースにinsert
            $sql = "INSERT INTO waterusers ( name, tel, address, mail, eth) VALUES (:name,:tel,:address,:mail,:eth)";
            $stmh = $pdo->prepare($sql);
            $params = array(':name' => $name, ':tel' => $tel, ':address' => $address, ':mail' => $mail, 'eth' => $eth);
            $stmh->execute($params);
        }

        ?>


        <div class="form-group">
            <label>お名前:</label>
            <input type="text" readonly class="form-control" value='<?= htmlspecialchars($name) ?>'>
        </div>
        <div class="form-group">
            <label>電話番号</label>
            <input type="text" readonly class="form-control" value='<?= htmlspecialchars($tel) ?>'>
        </div>
        <div class="form-group">
            <label>住所</label>
            <input type="text" readonly class="form-control" value='<?= htmlspecialchars($address) ?>'>
        </div>
        <div class="form-group">
            <label>メールアドレス</label>
            <input type="text" readonly class="form-control" value='<?= htmlspecialchars($mail) ?>'>
        </div>
        <div class="form-group">
            <label>ethのアカウント</label>
            <input type="text" readonly class="form-control" value='<?= htmlspecialchars($eth) ?>'>
        </div>

        以上の内容でよろしいでしょうか<br>
        <input type="submit" name="submit" value="送信"/>
        <?php

        if(isset($_POST["submit"])) { insert(); }

        try{
            // データベースへ接続
            $dbinfo = parse_url(getenv('DATABASE_URL'));
            $dsn = 'pgsql:host=' . $dbinfo['host'] . ';dbname=' . substr($dbinfo['path'], 1);
            $pdo = new PDO($dsn, $dbinfo['user'], $dbinfo['pass']);
        }catch (PDOException $e){
            print('Error:'.$e->getMessage());
            die();
        }
        try{
            $sql = "SELECT * FROM waterusers";
            $stmh = $pdo->prepare($sql);
            $stmh->execute();
        }catch(PDOException $Exception){
            die('接続エラー：' .$Exception->getMessage());
        }

        $dname=$row['mail'];
        $dphone=$row['phone'];
        $daddress=$row['address'];
        $dmail=$row['mail'];
        $deth=$row['eth'];
        ?>

        <div class="form-group">
            <label>名前:</label><br>
            <?= htmlspecialchars($dname) ?>
        </div>
        <div class="form-group">
            <label>電話番号</label><br>
            <?= htmlspecialchars($dtel) ?>
        </div>
        <div class="form-group">
            <label>住所</label><br>
            <?= htmlspecialchars($daddress) ?>
        </div>
        <div class="form-group">
            <label>メールアドレス</label><br>
            <?= htmlspecialchars($mail) ?>
        </div>
        <div class="form-group">
            <label>ethのアカウント</label><br>
            <?= htmlspecialchars($eth) ?>
        </div>


    </div>
</div>
<a href="waterserver_index.php">戻る</a>
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
