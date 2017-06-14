/**
 * Created by JohnMak on 29/10/15.
 */



module.exports.process = function(err){
  switch(err.responseText) {
      case 'no user': alertify.error('No such username'); break;
      case 'wrong credentials': alertify.error('Wrong password'); break;
      case 'username exist': alertify.error('Such username already exist'); break;
      case 'not permitted': alertify.error('You haven\'t such privileges'); break;
      case 'Unauthorized': alertify.error('You have been logged out'); MainRact.set('is_authorised', false);break;
      default:  alertify.error('Unknown: '+ err.responseText); break;
  }

};