<!DOCTYPE html>
<html>
<head>
    <title>水道管理アプリ</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <script src="https://code.jquery.com/jquery-3.4.0.min.js"></script>
    <link href="../css/server.css" rel="stylesheet">
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
            $sql = "SELECT * FROM water_users";
            $stmh = $pdo->prepare($sql);
            $stmh->execute();
        }catch(PDOException $Exception){
            die('接続エラー：' .$Exception->getMessage());
        }

        $name=$row['mail'];
        $phone=$row['phone'];
        $address=$row['address'];
        $mail=$row['mail'];
        $eth=$eth['eth'];
        ?>
        <div class="form-group">
            <label>名前:</label><br>
            <?= htmlspecialchars($name) ?>
        </div>
        <div class="form-group">
            <label>電話番号</label><br>
            <?= htmlspecialchars($tel) ?>
        </div>
        <div class="form-group">
            <label>住所</label><br>
            <?= htmlspecialchars($address) ?>
        </div>
        <div class="form-group">
            <label>メールアドレス</label><br>
            <?= htmlspecialchars($mail) ?>
        </div>
        <div class="form-group">
            <label>ethのアカウント</label><br>
            <?= htmlspecialchars($eth) ?>
        </div>


        解約しますか？<br>
        <div>
            <button type="submit" name="submit" class="btn btn-primary">解約</button>
            <br>
        </div>

        <?php
        /*
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


            //データベースにinsert
            $sql = "INSERT INTO water_users (name, tel, address, mail, eth) VALUES (:name, :tel, :address, :mail, :eth)";
            $stmh = $pdo->prepare($sql);
            $params = array(':name' => $name, ':tel' => $tel, ':address' => $address, ':mail' => $mail, 'eth' => $eth);
            $stmh->execute($params);
        }

        if(isset($_POST["submit"])) { insert(); }*/
        ?>

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
