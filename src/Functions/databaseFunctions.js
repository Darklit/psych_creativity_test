import * as firebase from 'firebase';

let functions = {
  getData: async function(parent,children){
    let refText = parent;
    if(children.length>0){
      for(let i = 0; i < children.length; i++){
        refText+=`/${children[i]}`;
      }
    }
    let getDat = function(refText){
    return new Promise((fulfill,reject) => {
        const ref = firebase.database().ref(refText);
        ref.once('value').then(dat => {

          fulfill(dat.val());
        }).catch(console.error);
      });
    }
    console.log(refText);
    let data = await getDat(refText);

    return data;
  }
}

export default functions;
