var app = new Vue({
  el: '#app',
  data: {
    allData: [],
    selectCountry: '新北市',
    isLoading: false,
    updateTime: '',
    Detail: {}
  },
  methods: {
    getData(){
      const vm = this;
      const apiUrl = 'https://data.epa.gov.tw/api/v1/aqx_p_432?offset=0&limit=100&api_key=f4b848de-1411-4e9e-855b-aab7d577724b';
      axios({
        method:'get',
        url:apiUrl,
      })
      .then(function (response) {
        console.log(response.data)
        vm.allData = response.data.records;
        vm.updateTime = vm.getTime();
        vm.Detail = vm.initDetail();
      })
      .catch(function (error) {
        console.log('取得資料失敗:' + error);
      });

      //promise XMLHttpRequest 寫法
      // let promise = new Promise((resolve, reject) => {
      //   let xhr = new XMLHttpRequest();
      //   xhr.open('get', apiUrl, true);
      //   xhr.send(null);
      //   xhr.onload = () =>{
      //     if (xhr.status >= 200 && xhr.status < 400) {
      //       resolve(xhr.response);
      //     } else {
      //       reject("取得資料失敗: " + xhr.status);
      //     }
      //   }
      // });
      // promise.then((res) => {
      //   vm.allData = JSON.parse(res);
      //   vm.updateTime = vm.getTime();
      //   vm.Detail = vm.initDetail();
      //   vm.isLoading = false;			
      // });
      // promise.catch((error) => {
      //   vm.updateTime = vm.getTime();
      //   vm.isLoading = false;
      //   console.log(error);
      // });
    },
    //取得更新時間
    getTime(){
      const now = new Date();
      let month = now.getMonth() + 1;
      console.log(now)
      if(month < 10){ month = `0${month}` }
      let timeStr = `${now.getFullYear()}/${month}/${now.getDate()} 
      ${now.getHours()}:${now.getMinutes()}`;
      return timeStr;
    },
    //初始值
    initDetail(country = '新北市'){
      const vm = this;
      return vm.allData.find((item) =>{
        return item.County === country;
      });
    },
    showDetail(item){
      const vm = this;
      vm.Detail = item;
    },
    //判斷品質顏色
    statusColor(status) {
      let className = '';
      switch (status) {
        case '良好':
          return className = 'great'
          break;
        case '普通':
          return className = 'normal'
          break;
        case '對敏感族群不健康':
          return className = 'ok'
          break;
        case '對所有族群不健康':
          return className = 'notGood'
          break;
        case '非常不健康':
          return className = 'myGod'
          break;
        case '危害':
          return className = 'danger'
          break;
        default:
          return className
          break;
      }
    }
  },
  computed: {
    filterCountryArray(){
      const vm = this;
      let countyArray = [];
      for (let i = 0; i < vm.allData.length; i++) {
        countyArray[i] = vm.allData[i].County
      }
      //找出不重覆的值
      return countyArray.filter((element, index, arr) => {
        return arr.indexOf(element) === index;
      });
    },
    filterCountryData(){
      const vm = this;
      if(!vm.selectCountry){    
        return vm.allData.filter((item) => {
          return item.County === '新北市';
        });
      } else {
        vm.Detail = vm.initDetail(vm.selectCountry);
        return vm.allData.filter((item) => {
          return item.County === vm.selectCountry;
        });
      }
    }
  },
  created() {
    this.getData();
  },
})