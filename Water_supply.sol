pragma solidity ^0.5.10;

contract Water_supply {
    
    address public admin;//管理者
    address public user;//使用者
    address payable public sender = 0x1cd248fd0CAB42123758e5141ba143894df7f7F3;//送金先アドレス
    uint amount_of_water;//当月の使用量
    uint diameter;//口径（０から９の数字で） 
    uint wallet;//財布
    uint[] public basic_rate = [1296,1620,2700,3510,7560,16200,42120,93960,234900,446040];//基本料金
    uint[] public history_water;//水の量の履歴
    uint[] public history_charge;//支払の履歴
    uint public unpaid_charge;//未払いの料金
    uint public not_pay_counter = 0;//未払いの回数
    bool public on_working = true;//水道が動いているかどうか

    //コンストラクター
    constructor(address _user, uint _diameter) public {
        admin = msg.sender;
        user = _user;
        diameter = _diameter;
    }
    
    //オーナーのみ実行可
    modifier onlyAdmin() {
        if(msg.sender != admin) revert();
        _;
    }
    //ユーザーのみ実行可
    modifier onlyUser() {
        if(msg.sender != user) revert();
        _;
    }
    
    //ユーザー情報の取得
    function get_user_info() public view onlyAdmin returns (uint, uint, uint, uint[] memory, uint[] memory, uint, uint, bool) {
        return(amount_of_water, diameter, wallet, get_history_water(), get_history_charge(), unpaid_charge, not_pay_counter, on_working);
    }
    
    //送金先を変更
    function set_sender(address payable newSender) public onlyAdmin {
        sender = newSender;
    }

    //デポジットされた金額を表示
    function get_wallet() public view returns (uint) {
        return wallet;
    }
    
    //当月の水量を表示
    function get_amount_of_water() public view returns (uint) {
        return amount_of_water;
    }
    
    //デポジット
    function deposit() public payable {//onlyUser {
        if(msg.value <= 0) revert();
        wallet += msg.value;
    }
    
    //料金の支払い
    function payment() private {
        uint charge = calc_charge() + unpaid_charge;
        if(wallet < charge) {
                unpaid_charge = charge;
                not_pay_counter += 1;
                if(not_pay_counter  > 0) {
                    stop_working();
                }
                
        }else{
            sender.transfer(charge);
            wallet -= charge;
            unpaid_charge = 0;
        }
    }
    
    //未払い金の支払い
    function pay_unpaid_charge() public {
        if(wallet < unpaid_charge) revert();
        sender.transfer(unpaid_charge);
        wallet -= unpaid_charge;
        unpaid_charge = 0;
        not_pay_counter = 0;
        if (!on_working) {
            start_working();
        }
    }

    //従量料金の計算(つくば市参考)
    function calc_commodity_charge(uint _amount_of_water) public view returns (uint){
        if(diameter <= 2){
            if(_amount_of_water <= 10){
                return 0;
            }else{
                return 151;
            }

        }else{
            if(_amount_of_water <= 20){
                return 151;
            } else if(_amount_of_water <=40) {
                return 194;
            } else if(_amount_of_water <=100) {
                return 237;
            } else if(_amount_of_water <=500) {
                return 280;
            } else {
                return 324;
            }
        }
    }

    //支払い料金の計算（つくば市参考）
    function calc_charge() public view returns(uint) {
        return basic_rate[diameter] + calc_commodity_charge(amount_of_water) * amount_of_water;
    }

    //当月の水量を入力    
    function set_used_water(uint _amount_of_water) public {
        if (!on_working) revert();
        amount_of_water = _amount_of_water;
        set_history();
        diameter = 1;
        payment();
    }
    

    //履歴の更新
    function set_history() public {
        history_water.push(get_amount_of_water());
        history_charge.push(calc_charge());
    }
    
    //使った水の量の履歴を返す関数
    function get_history_water() public view returns(uint[] memory){
        uint array_length = history_water.length;
        uint[] memory arrayMemory = new uint[](array_length);
        arrayMemory = history_water;
        return arrayMemory;
    }

    //料金の履歴を返す関数
    function get_history_charge() public view returns(uint[] memory){
        uint array_length = history_charge.length;
        uint[] memory arrayMemory = new uint[](array_length);
        arrayMemory = history_charge;
        return arrayMemory;
    }
    
    //未払金の回数を返す関数
    function get_not_pay_counter() public view returns(uint){
        return not_pay_counter;
    }

    //未払金を返す関数
    function get_unpaid_charge() public view returns(uint){
        return unpaid_charge;
    }
    
    //水道のon
    function start_working() private {
        if(on_working) revert();
        on_working = true;
    }
    
    //水道のoff
    function stop_working() private {
        if(!on_working) revert();
        on_working = false;
    }
    
    //水道が動いているかどうかを返す関数
    function get_on_working() public view returns(bool){
        return on_working;
    }

}
