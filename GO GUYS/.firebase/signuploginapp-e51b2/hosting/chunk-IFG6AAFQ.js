import{Sa as c,f as n,s as o,v as i,ya as u}from"./chunk-JOBGMPTA.js";import{d as a}from"./chunk-U3NIYLHF.js";var m=(()=>{class t{constructor(e,r){this.auth=e,this.router=r}isAuthenticated(){return this.auth.authState.pipe(n(e=>!!e))}login(e,r){return a(this,null,function*(){try{if(!e||!r)return{success:!1,message:"Email and password are required."};let s=yield this.auth.signInWithEmailAndPassword(e,r);return s.user?s.user.emailVerified?{success:!0,message:"Login successful"}:(yield s.user.sendEmailVerification(),yield this.auth.signOut(),{success:!1,message:"Email not verified. Verification email sent."}):{success:!1,message:"Login failed. Please try again."}}catch(s){return console.error("Login error:",s),{success:!1,message:this.getAuthErrorMessage(s)}}})}resendVerificationEmail(){return a(this,null,function*(){try{let e=yield this.auth.currentUser;return e?(yield e.sendEmailVerification(),{success:!0,message:"Verification email sent!"}):{success:!1,message:"No user found."}}catch(e){return console.error("Error sending verification email:",e),{success:!1,message:this.getAuthErrorMessage(e)}}})}logout(){return a(this,null,function*(){try{yield this.auth.signOut(),this.router.navigate(["/login"])}catch(e){console.error("Logout error:",e)}})}resetPassword(e){return a(this,null,function*(){try{return yield this.auth.sendPasswordResetEmail(e),{success:!0,message:"Password reset email sent!"}}catch(r){return{success:!1,message:this.getAuthErrorMessage(r)}}})}getAuthErrorMessage(e){switch(e.code){case"auth/invalid-credential":return"Incorrect email or password.";case"auth/user-not-found":return"No user found with this email.";case"auth/wrong-password":return"Wrong password. Please try again.";case"auth/too-many-requests":return"Too many failed attempts. Try again later.";default:return"Login failed. Please try again."}}static{this.\u0275fac=function(r){return new(r||t)(i(c),i(u))}}static{this.\u0275prov=o({token:t,factory:t.\u0275fac,providedIn:"root"})}}return t})();export{m as a};
