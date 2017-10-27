/**
 * Created by Administrator on 2017/10/25.
 */
document.getElementById('upProfile').addEventListener('change',function(){
    var that=this;
    if(this.files.length!==0){
        var file = this.files[0],
            reader = new FileReader();
        if (!reader) {
            that._displayNewMsg('system', '!your browser doesn\'t support fileReader', 'red');
            // this.value = '';
            return;
        };
        reader.onload = function(e) {
            // that.value = '';
            document.getElementById('profileImg').setAttribute('src',e.target.result)
        };
        reader.readAsDataURL(file);
    }
},false);