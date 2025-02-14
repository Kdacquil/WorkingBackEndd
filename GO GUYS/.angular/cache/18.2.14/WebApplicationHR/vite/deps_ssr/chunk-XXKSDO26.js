import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  firebase
} from "./chunk-4ASMHKVJ.js";
import {
  ActionCodeOperation,
  AuthCredential,
  BaseOAuthProvider,
  EmailAuthProvider,
  FacebookAuthProvider,
  FederatedAuthProvider,
  FetchProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  OAuthCredential,
  OAuthProvider,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  ProviderId,
  RecaptchaVerifier,
  SAMLAuthCredential,
  SAMLAuthProvider,
  TwitterAuthProvider,
  _assert,
  _castAuth,
  _createError,
  _emulatorUrl,
  _fail,
  _getInstance,
  _isAndroid,
  _isIE10,
  _isIOS,
  _isIOS7Or8,
  _isMobileBrowser,
  _link,
  _performApiRequest,
  _persistenceKeyName,
  _reauthenticate,
  _serverAppCurrentUserOperationNotSupportedError,
  _signInWithCredential,
  applyActionCode,
  browserLocalPersistence,
  browserPopupRedirectResolver,
  browserSessionPersistence,
  checkActionCode,
  confirmPasswordReset,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  debugAssert,
  debugErrorMap,
  fetchSignInMethodsForEmail,
  getAdditionalUserInfo,
  getMultiFactorResolver,
  getRedirectResult,
  inMemoryPersistence,
  indexedDBLocalPersistence,
  isSignInWithEmailLink,
  linkWithCredential,
  linkWithPhoneNumber,
  linkWithPopup,
  linkWithRedirect,
  multiFactor,
  reauthenticateWithCredential,
  reauthenticateWithPhoneNumber,
  reauthenticateWithPopup,
  reauthenticateWithRedirect,
  sendEmailVerification,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  signInAnonymously,
  signInWithCredential,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signInWithIdp,
  signInWithPhoneNumber,
  signInWithPopup,
  signInWithRedirect,
  unlink,
  updateEmail,
  updatePassword,
  updatePhoneNumber,
  updateProfile,
  verifyBeforeUpdateEmail,
  verifyPasswordResetCode
} from "./chunk-EBS6IGXO.js";
import {
  require_undici
} from "./chunk-D5NCJWRM.js";
import {
  Component,
  FirebaseError,
  SDK_VERSION,
  _isFirebaseServerApp,
  getUA,
  isBrowserExtension,
  isEmpty,
  isIE,
  isIndexedDBAvailable,
  isNode,
  isReactNative,
  querystring,
  querystringDecode
} from "./chunk-B2TLZR27.js";
import {
  __async,
  __superGet,
  __toESM
} from "./chunk-LKDWXENB.js";

// node_modules/@angular/fire/node_modules/@firebase/auth/dist/node-esm/internal.js
var import_undici = __toESM(require_undici());
function _generateEventId(prefix = "", digits = 10) {
  let random = "";
  for (let i = 0; i < digits; i++) {
    random += Math.floor(Math.random() * 10);
  }
  return prefix + random;
}
function _withDefaultResolver(auth, resolverOverride) {
  if (resolverOverride) {
    return _getInstance(resolverOverride);
  }
  _assert(
    auth._popupRedirectResolver,
    auth,
    "argument-error"
    /* AuthErrorCode.ARGUMENT_ERROR */
  );
  return auth._popupRedirectResolver;
}
var IdpCredential = class extends AuthCredential {
  constructor(params) {
    super(
      "custom",
      "custom"
      /* ProviderId.CUSTOM */
    );
    this.params = params;
  }
  _getIdTokenResponse(auth) {
    return signInWithIdp(auth, this._buildIdpRequest());
  }
  _linkToIdToken(auth, idToken) {
    return signInWithIdp(auth, this._buildIdpRequest(idToken));
  }
  _getReauthenticationResolver(auth) {
    return signInWithIdp(auth, this._buildIdpRequest());
  }
  _buildIdpRequest(idToken) {
    const request = {
      requestUri: this.params.requestUri,
      sessionId: this.params.sessionId,
      postBody: this.params.postBody,
      tenantId: this.params.tenantId,
      pendingToken: this.params.pendingToken,
      returnSecureToken: true,
      returnIdpCredential: true
    };
    if (idToken) {
      request.idToken = idToken;
    }
    return request;
  }
};
function _signIn(params) {
  return _signInWithCredential(params.auth, new IdpCredential(params), params.bypassAuthState);
}
function _reauth(params) {
  const {
    auth,
    user
  } = params;
  _assert(
    user,
    auth,
    "internal-error"
    /* AuthErrorCode.INTERNAL_ERROR */
  );
  return _reauthenticate(user, new IdpCredential(params), params.bypassAuthState);
}
function _link2(params) {
  return __async(this, null, function* () {
    const {
      auth,
      user
    } = params;
    _assert(
      user,
      auth,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    return _link(user, new IdpCredential(params), params.bypassAuthState);
  });
}
var AbstractPopupRedirectOperation = class {
  constructor(auth, filter, resolver, user, bypassAuthState = false) {
    this.auth = auth;
    this.resolver = resolver;
    this.user = user;
    this.bypassAuthState = bypassAuthState;
    this.pendingPromise = null;
    this.eventManager = null;
    this.filter = Array.isArray(filter) ? filter : [filter];
  }
  execute() {
    return new Promise((resolve, reject) => __async(this, null, function* () {
      this.pendingPromise = {
        resolve,
        reject
      };
      try {
        this.eventManager = yield this.resolver._initialize(this.auth);
        yield this.onExecution();
        this.eventManager.registerConsumer(this);
      } catch (e) {
        this.reject(e);
      }
    }));
  }
  onAuthEvent(event) {
    return __async(this, null, function* () {
      const {
        urlResponse,
        sessionId,
        postBody,
        tenantId,
        error,
        type
      } = event;
      if (error) {
        this.reject(error);
        return;
      }
      const params = {
        auth: this.auth,
        requestUri: urlResponse,
        sessionId,
        tenantId: tenantId || void 0,
        postBody: postBody || void 0,
        user: this.user,
        bypassAuthState: this.bypassAuthState
      };
      try {
        this.resolve(yield this.getIdpTask(type)(params));
      } catch (e) {
        this.reject(e);
      }
    });
  }
  onError(error) {
    this.reject(error);
  }
  getIdpTask(type) {
    switch (type) {
      case "signInViaPopup":
      case "signInViaRedirect":
        return _signIn;
      case "linkViaPopup":
      case "linkViaRedirect":
        return _link2;
      case "reauthViaPopup":
      case "reauthViaRedirect":
        return _reauth;
      default:
        _fail(
          this.auth,
          "internal-error"
          /* AuthErrorCode.INTERNAL_ERROR */
        );
    }
  }
  resolve(cred) {
    debugAssert(this.pendingPromise, "Pending promise was never set");
    this.pendingPromise.resolve(cred);
    this.unregisterAndCleanUp();
  }
  reject(error) {
    debugAssert(this.pendingPromise, "Pending promise was never set");
    this.pendingPromise.reject(error);
    this.unregisterAndCleanUp();
  }
  unregisterAndCleanUp() {
    if (this.eventManager) {
      this.eventManager.unregisterConsumer(this);
    }
    this.pendingPromise = null;
    this.cleanUp();
  }
};
var PENDING_REDIRECT_KEY = "pendingRedirect";
var redirectOutcomeMap = /* @__PURE__ */ new Map();
var RedirectAction = class _RedirectAction extends AbstractPopupRedirectOperation {
  constructor(auth, resolver, bypassAuthState = false) {
    super(auth, [
      "signInViaRedirect",
      "linkViaRedirect",
      "reauthViaRedirect",
      "unknown"
      /* AuthEventType.UNKNOWN */
    ], resolver, void 0, bypassAuthState);
    this.eventId = null;
  }
  /**
   * Override the execute function; if we already have a redirect result, then
   * just return it.
   */
  execute() {
    return __async(this, null, function* () {
      let readyOutcome = redirectOutcomeMap.get(this.auth._key());
      if (!readyOutcome) {
        try {
          const hasPendingRedirect = yield _getAndClearPendingRedirectStatus(this.resolver, this.auth);
          const result = hasPendingRedirect ? yield __superGet(_RedirectAction.prototype, this, "execute").call(this) : null;
          readyOutcome = () => Promise.resolve(result);
        } catch (e) {
          readyOutcome = () => Promise.reject(e);
        }
        redirectOutcomeMap.set(this.auth._key(), readyOutcome);
      }
      if (!this.bypassAuthState) {
        redirectOutcomeMap.set(this.auth._key(), () => Promise.resolve(null));
      }
      return readyOutcome();
    });
  }
  onAuthEvent(event) {
    return __async(this, null, function* () {
      if (event.type === "signInViaRedirect") {
        return __superGet(_RedirectAction.prototype, this, "onAuthEvent").call(this, event);
      } else if (event.type === "unknown") {
        this.resolve(null);
        return;
      }
      if (event.eventId) {
        const user = yield this.auth._redirectUserForId(event.eventId);
        if (user) {
          this.user = user;
          return __superGet(_RedirectAction.prototype, this, "onAuthEvent").call(this, event);
        } else {
          this.resolve(null);
        }
      }
    });
  }
  onExecution() {
    return __async(this, null, function* () {
    });
  }
  cleanUp() {
  }
};
function _getAndClearPendingRedirectStatus(resolver, auth) {
  return __async(this, null, function* () {
    const key = pendingRedirectKey(auth);
    const persistence = resolverPersistence(resolver);
    if (!(yield persistence._isAvailable())) {
      return false;
    }
    const hasPendingRedirect = (yield persistence._get(key)) === "true";
    yield persistence._remove(key);
    return hasPendingRedirect;
  });
}
function _clearRedirectOutcomes() {
  redirectOutcomeMap.clear();
}
function _overrideRedirectResult(auth, result) {
  redirectOutcomeMap.set(auth._key(), result);
}
function resolverPersistence(resolver) {
  return _getInstance(resolver._redirectPersistence);
}
function pendingRedirectKey(auth) {
  return _persistenceKeyName(PENDING_REDIRECT_KEY, auth.config.apiKey, auth.name);
}
function _getRedirectResult(auth, resolverExtern, bypassAuthState = false) {
  return __async(this, null, function* () {
    if (_isFirebaseServerApp(auth.app)) {
      return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(auth));
    }
    const authInternal = _castAuth(auth);
    const resolver = _withDefaultResolver(authInternal, resolverExtern);
    const action = new RedirectAction(authInternal, resolver, bypassAuthState);
    const result = yield action.execute();
    if (result && !bypassAuthState) {
      delete result.user._redirectEventId;
      yield authInternal._persistUserIfCurrent(result.user);
      yield authInternal._setRedirectUser(null, resolverExtern);
    }
    return result;
  });
}
var STORAGE_AVAILABLE_KEY = "__sak";
var BrowserPersistenceClass = class {
  constructor(storageRetriever, type) {
    this.storageRetriever = storageRetriever;
    this.type = type;
  }
  _isAvailable() {
    try {
      if (!this.storage) {
        return Promise.resolve(false);
      }
      this.storage.setItem(STORAGE_AVAILABLE_KEY, "1");
      this.storage.removeItem(STORAGE_AVAILABLE_KEY);
      return Promise.resolve(true);
    } catch (_a) {
      return Promise.resolve(false);
    }
  }
  _set(key, value) {
    this.storage.setItem(key, JSON.stringify(value));
    return Promise.resolve();
  }
  _get(key) {
    const json = this.storage.getItem(key);
    return Promise.resolve(json ? JSON.parse(json) : null);
  }
  _remove(key) {
    this.storage.removeItem(key);
    return Promise.resolve();
  }
  get storage() {
    return this.storageRetriever();
  }
};
var BrowserSessionPersistence = class extends BrowserPersistenceClass {
  constructor() {
    super(
      () => window.sessionStorage,
      "SESSION"
      /* PersistenceType.SESSION */
    );
  }
  _addListener(_key, _listener) {
    return;
  }
  _removeListener(_key, _listener) {
    return;
  }
};
BrowserSessionPersistence.type = "SESSION";
var browserSessionPersistence2 = BrowserSessionPersistence;
var WIDGET_PATH = "__/auth/handler";
var EMULATOR_WIDGET_PATH = "emulator/auth/handler";
var FIREBASE_APP_CHECK_FRAGMENT_ID = encodeURIComponent("fac");
function _getRedirectUrl(auth, provider, authType, redirectUrl, eventId, additionalParams) {
  return __async(this, null, function* () {
    _assert(
      auth.config.authDomain,
      auth,
      "auth-domain-config-required"
      /* AuthErrorCode.MISSING_AUTH_DOMAIN */
    );
    _assert(
      auth.config.apiKey,
      auth,
      "invalid-api-key"
      /* AuthErrorCode.INVALID_API_KEY */
    );
    const params = {
      apiKey: auth.config.apiKey,
      appName: auth.name,
      authType,
      redirectUrl,
      v: SDK_VERSION,
      eventId
    };
    if (provider instanceof FederatedAuthProvider) {
      provider.setDefaultLanguage(auth.languageCode);
      params.providerId = provider.providerId || "";
      if (!isEmpty(provider.getCustomParameters())) {
        params.customParameters = JSON.stringify(provider.getCustomParameters());
      }
      for (const [key, value] of Object.entries(additionalParams || {})) {
        params[key] = value;
      }
    }
    if (provider instanceof BaseOAuthProvider) {
      const scopes = provider.getScopes().filter((scope) => scope !== "");
      if (scopes.length > 0) {
        params.scopes = scopes.join(",");
      }
    }
    if (auth.tenantId) {
      params.tid = auth.tenantId;
    }
    const paramsDict = params;
    for (const key of Object.keys(paramsDict)) {
      if (paramsDict[key] === void 0) {
        delete paramsDict[key];
      }
    }
    const appCheckToken = yield auth._getAppCheckToken();
    const appCheckTokenFragment = appCheckToken ? `#${FIREBASE_APP_CHECK_FRAGMENT_ID}=${encodeURIComponent(appCheckToken)}` : "";
    return `${getHandlerBase(auth)}?${querystring(paramsDict).slice(1)}${appCheckTokenFragment}`;
  });
}
function getHandlerBase({
  config
}) {
  if (!config.emulator) {
    return `https://${config.authDomain}/${WIDGET_PATH}`;
  }
  return _emulatorUrl(config, EMULATOR_WIDGET_PATH);
}
function _cordovaWindow() {
  return window;
}
function _getProjectConfig(_0) {
  return __async(this, arguments, function* (auth, request = {}) {
    return _performApiRequest(auth, "GET", "/v1/projects", request);
  });
}
var REDIRECT_TIMEOUT_MS = 2e3;
function _generateHandlerUrl(auth, event, provider) {
  return __async(this, null, function* () {
    var _a;
    const {
      BuildInfo
    } = _cordovaWindow();
    debugAssert(event.sessionId, "AuthEvent did not contain a session ID");
    const sessionDigest = yield computeSha256(event.sessionId);
    const additionalParams = {};
    if (_isIOS()) {
      additionalParams["ibi"] = BuildInfo.packageName;
    } else if (_isAndroid()) {
      additionalParams["apn"] = BuildInfo.packageName;
    } else {
      _fail(
        auth,
        "operation-not-supported-in-this-environment"
        /* AuthErrorCode.OPERATION_NOT_SUPPORTED */
      );
    }
    if (BuildInfo.displayName) {
      additionalParams["appDisplayName"] = BuildInfo.displayName;
    }
    additionalParams["sessionId"] = sessionDigest;
    return _getRedirectUrl(auth, provider, event.type, void 0, (_a = event.eventId) !== null && _a !== void 0 ? _a : void 0, additionalParams);
  });
}
function _validateOrigin(auth) {
  return __async(this, null, function* () {
    const {
      BuildInfo
    } = _cordovaWindow();
    const request = {};
    if (_isIOS()) {
      request.iosBundleId = BuildInfo.packageName;
    } else if (_isAndroid()) {
      request.androidPackageName = BuildInfo.packageName;
    } else {
      _fail(
        auth,
        "operation-not-supported-in-this-environment"
        /* AuthErrorCode.OPERATION_NOT_SUPPORTED */
      );
    }
    yield _getProjectConfig(auth, request);
  });
}
function _performRedirect(handlerUrl) {
  const {
    cordova
  } = _cordovaWindow();
  return new Promise((resolve) => {
    cordova.plugins.browsertab.isAvailable((browserTabIsAvailable) => {
      let iabRef = null;
      if (browserTabIsAvailable) {
        cordova.plugins.browsertab.openUrl(handlerUrl);
      } else {
        iabRef = cordova.InAppBrowser.open(handlerUrl, _isIOS7Or8() ? "_blank" : "_system", "location=yes");
      }
      resolve(iabRef);
    });
  });
}
function _waitForAppResume(auth, eventListener, iabRef) {
  return __async(this, null, function* () {
    const {
      cordova
    } = _cordovaWindow();
    let cleanup = () => {
    };
    try {
      yield new Promise((resolve, reject) => {
        let onCloseTimer = null;
        function authEventSeen() {
          var _a;
          resolve();
          const closeBrowserTab = (_a = cordova.plugins.browsertab) === null || _a === void 0 ? void 0 : _a.close;
          if (typeof closeBrowserTab === "function") {
            closeBrowserTab();
          }
          if (typeof (iabRef === null || iabRef === void 0 ? void 0 : iabRef.close) === "function") {
            iabRef.close();
          }
        }
        function resumed() {
          if (onCloseTimer) {
            return;
          }
          onCloseTimer = window.setTimeout(() => {
            reject(_createError(
              auth,
              "redirect-cancelled-by-user"
              /* AuthErrorCode.REDIRECT_CANCELLED_BY_USER */
            ));
          }, REDIRECT_TIMEOUT_MS);
        }
        function visibilityChanged() {
          if ((document === null || document === void 0 ? void 0 : document.visibilityState) === "visible") {
            resumed();
          }
        }
        eventListener.addPassiveListener(authEventSeen);
        document.addEventListener("resume", resumed, false);
        if (_isAndroid()) {
          document.addEventListener("visibilitychange", visibilityChanged, false);
        }
        cleanup = () => {
          eventListener.removePassiveListener(authEventSeen);
          document.removeEventListener("resume", resumed, false);
          document.removeEventListener("visibilitychange", visibilityChanged, false);
          if (onCloseTimer) {
            window.clearTimeout(onCloseTimer);
          }
        };
      });
    } finally {
      cleanup();
    }
  });
}
function _checkCordovaConfiguration(auth) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
  const win = _cordovaWindow();
  _assert(typeof ((_a = win === null || win === void 0 ? void 0 : win.universalLinks) === null || _a === void 0 ? void 0 : _a.subscribe) === "function", auth, "invalid-cordova-configuration", {
    missingPlugin: "cordova-universal-links-plugin-fix"
  });
  _assert(typeof ((_b = win === null || win === void 0 ? void 0 : win.BuildInfo) === null || _b === void 0 ? void 0 : _b.packageName) !== "undefined", auth, "invalid-cordova-configuration", {
    missingPlugin: "cordova-plugin-buildInfo"
  });
  _assert(typeof ((_e = (_d = (_c = win === null || win === void 0 ? void 0 : win.cordova) === null || _c === void 0 ? void 0 : _c.plugins) === null || _d === void 0 ? void 0 : _d.browsertab) === null || _e === void 0 ? void 0 : _e.openUrl) === "function", auth, "invalid-cordova-configuration", {
    missingPlugin: "cordova-plugin-browsertab"
  });
  _assert(typeof ((_h = (_g = (_f = win === null || win === void 0 ? void 0 : win.cordova) === null || _f === void 0 ? void 0 : _f.plugins) === null || _g === void 0 ? void 0 : _g.browsertab) === null || _h === void 0 ? void 0 : _h.isAvailable) === "function", auth, "invalid-cordova-configuration", {
    missingPlugin: "cordova-plugin-browsertab"
  });
  _assert(typeof ((_k = (_j = win === null || win === void 0 ? void 0 : win.cordova) === null || _j === void 0 ? void 0 : _j.InAppBrowser) === null || _k === void 0 ? void 0 : _k.open) === "function", auth, "invalid-cordova-configuration", {
    missingPlugin: "cordova-plugin-inappbrowser"
  });
}
function computeSha256(sessionId) {
  return __async(this, null, function* () {
    const bytes = stringToArrayBuffer(sessionId);
    const buf = yield crypto.subtle.digest("SHA-256", bytes);
    const arr = Array.from(new Uint8Array(buf));
    return arr.map((num) => num.toString(16).padStart(2, "0")).join("");
  });
}
function stringToArrayBuffer(str) {
  debugAssert(/[0-9a-zA-Z]+/.test(str), "Can only convert alpha-numeric strings");
  if (typeof TextEncoder !== "undefined") {
    return new TextEncoder().encode(str);
  }
  const buff = new ArrayBuffer(str.length);
  const view = new Uint8Array(buff);
  for (let i = 0; i < str.length; i++) {
    view[i] = str.charCodeAt(i);
  }
  return view;
}
var EVENT_DUPLICATION_CACHE_DURATION_MS = 10 * 60 * 1e3;
var AuthEventManager = class {
  constructor(auth) {
    this.auth = auth;
    this.cachedEventUids = /* @__PURE__ */ new Set();
    this.consumers = /* @__PURE__ */ new Set();
    this.queuedRedirectEvent = null;
    this.hasHandledPotentialRedirect = false;
    this.lastProcessedEventTime = Date.now();
  }
  registerConsumer(authEventConsumer) {
    this.consumers.add(authEventConsumer);
    if (this.queuedRedirectEvent && this.isEventForConsumer(this.queuedRedirectEvent, authEventConsumer)) {
      this.sendToConsumer(this.queuedRedirectEvent, authEventConsumer);
      this.saveEventToCache(this.queuedRedirectEvent);
      this.queuedRedirectEvent = null;
    }
  }
  unregisterConsumer(authEventConsumer) {
    this.consumers.delete(authEventConsumer);
  }
  onEvent(event) {
    if (this.hasEventBeenHandled(event)) {
      return false;
    }
    let handled = false;
    this.consumers.forEach((consumer) => {
      if (this.isEventForConsumer(event, consumer)) {
        handled = true;
        this.sendToConsumer(event, consumer);
        this.saveEventToCache(event);
      }
    });
    if (this.hasHandledPotentialRedirect || !isRedirectEvent(event)) {
      return handled;
    }
    this.hasHandledPotentialRedirect = true;
    if (!handled) {
      this.queuedRedirectEvent = event;
      handled = true;
    }
    return handled;
  }
  sendToConsumer(event, consumer) {
    var _a;
    if (event.error && !isNullRedirectEvent(event)) {
      const code = ((_a = event.error.code) === null || _a === void 0 ? void 0 : _a.split("auth/")[1]) || "internal-error";
      consumer.onError(_createError(this.auth, code));
    } else {
      consumer.onAuthEvent(event);
    }
  }
  isEventForConsumer(event, consumer) {
    const eventIdMatches = consumer.eventId === null || !!event.eventId && event.eventId === consumer.eventId;
    return consumer.filter.includes(event.type) && eventIdMatches;
  }
  hasEventBeenHandled(event) {
    if (Date.now() - this.lastProcessedEventTime >= EVENT_DUPLICATION_CACHE_DURATION_MS) {
      this.cachedEventUids.clear();
    }
    return this.cachedEventUids.has(eventUid(event));
  }
  saveEventToCache(event) {
    this.cachedEventUids.add(eventUid(event));
    this.lastProcessedEventTime = Date.now();
  }
};
function eventUid(e) {
  return [e.type, e.eventId, e.sessionId, e.tenantId].filter((v) => v).join("-");
}
function isNullRedirectEvent({
  type,
  error
}) {
  return type === "unknown" && (error === null || error === void 0 ? void 0 : error.code) === `auth/${"no-auth-event"}`;
}
function isRedirectEvent(event) {
  switch (event.type) {
    case "signInViaRedirect":
    case "linkViaRedirect":
    case "reauthViaRedirect":
      return true;
    case "unknown":
      return isNullRedirectEvent(event);
    default:
      return false;
  }
}
var _POLLING_INTERVAL_MS = 1e3;
var IE10_LOCAL_STORAGE_SYNC_DELAY = 10;
var BrowserLocalPersistence = class _BrowserLocalPersistence extends BrowserPersistenceClass {
  constructor() {
    super(
      () => window.localStorage,
      "LOCAL"
      /* PersistenceType.LOCAL */
    );
    this.boundEventHandler = (event, poll) => this.onStorageEvent(event, poll);
    this.listeners = {};
    this.localCache = {};
    this.pollTimer = null;
    this.fallbackToPolling = _isMobileBrowser();
    this._shouldAllowMigration = true;
  }
  forAllChangedKeys(cb) {
    for (const key of Object.keys(this.listeners)) {
      const newValue = this.storage.getItem(key);
      const oldValue = this.localCache[key];
      if (newValue !== oldValue) {
        cb(key, oldValue, newValue);
      }
    }
  }
  onStorageEvent(event, poll = false) {
    if (!event.key) {
      this.forAllChangedKeys((key2, _oldValue, newValue) => {
        this.notifyListeners(key2, newValue);
      });
      return;
    }
    const key = event.key;
    if (poll) {
      this.detachListener();
    } else {
      this.stopPolling();
    }
    const triggerListeners = () => {
      const storedValue2 = this.storage.getItem(key);
      if (!poll && this.localCache[key] === storedValue2) {
        return;
      }
      this.notifyListeners(key, storedValue2);
    };
    const storedValue = this.storage.getItem(key);
    if (_isIE10() && storedValue !== event.newValue && event.newValue !== event.oldValue) {
      setTimeout(triggerListeners, IE10_LOCAL_STORAGE_SYNC_DELAY);
    } else {
      triggerListeners();
    }
  }
  notifyListeners(key, value) {
    this.localCache[key] = value;
    const listeners = this.listeners[key];
    if (listeners) {
      for (const listener of Array.from(listeners)) {
        listener(value ? JSON.parse(value) : value);
      }
    }
  }
  startPolling() {
    this.stopPolling();
    this.pollTimer = setInterval(() => {
      this.forAllChangedKeys((key, oldValue, newValue) => {
        this.onStorageEvent(
          new StorageEvent("storage", {
            key,
            oldValue,
            newValue
          }),
          /* poll */
          true
        );
      });
    }, _POLLING_INTERVAL_MS);
  }
  stopPolling() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }
  attachListener() {
    window.addEventListener("storage", this.boundEventHandler);
  }
  detachListener() {
    window.removeEventListener("storage", this.boundEventHandler);
  }
  _addListener(key, listener) {
    if (Object.keys(this.listeners).length === 0) {
      if (this.fallbackToPolling) {
        this.startPolling();
      } else {
        this.attachListener();
      }
    }
    if (!this.listeners[key]) {
      this.listeners[key] = /* @__PURE__ */ new Set();
      this.localCache[key] = this.storage.getItem(key);
    }
    this.listeners[key].add(listener);
  }
  _removeListener(key, listener) {
    if (this.listeners[key]) {
      this.listeners[key].delete(listener);
      if (this.listeners[key].size === 0) {
        delete this.listeners[key];
      }
    }
    if (Object.keys(this.listeners).length === 0) {
      this.detachListener();
      this.stopPolling();
    }
  }
  // Update local cache on base operations:
  _set(key, value) {
    return __async(this, null, function* () {
      yield __superGet(_BrowserLocalPersistence.prototype, this, "_set").call(this, key, value);
      this.localCache[key] = JSON.stringify(value);
    });
  }
  _get(key) {
    return __async(this, null, function* () {
      const value = yield __superGet(_BrowserLocalPersistence.prototype, this, "_get").call(this, key);
      this.localCache[key] = JSON.stringify(value);
      return value;
    });
  }
  _remove(key) {
    return __async(this, null, function* () {
      yield __superGet(_BrowserLocalPersistence.prototype, this, "_remove").call(this, key);
      delete this.localCache[key];
    });
  }
};
BrowserLocalPersistence.type = "LOCAL";
var browserLocalPersistence2 = BrowserLocalPersistence;
var SESSION_ID_LENGTH = 20;
var CordovaAuthEventManager = class extends AuthEventManager {
  constructor() {
    super(...arguments);
    this.passiveListeners = /* @__PURE__ */ new Set();
    this.initPromise = new Promise((resolve) => {
      this.resolveInitialized = resolve;
    });
  }
  addPassiveListener(cb) {
    this.passiveListeners.add(cb);
  }
  removePassiveListener(cb) {
    this.passiveListeners.delete(cb);
  }
  // In a Cordova environment, this manager can live through multiple redirect
  // operations
  resetRedirect() {
    this.queuedRedirectEvent = null;
    this.hasHandledPotentialRedirect = false;
  }
  /** Override the onEvent method */
  onEvent(event) {
    this.resolveInitialized();
    this.passiveListeners.forEach((cb) => cb(event));
    return super.onEvent(event);
  }
  initialized() {
    return __async(this, null, function* () {
      yield this.initPromise;
    });
  }
};
function _generateNewEvent(auth, type, eventId = null) {
  return {
    type,
    eventId,
    urlResponse: null,
    sessionId: generateSessionId(),
    postBody: null,
    tenantId: auth.tenantId,
    error: _createError(
      auth,
      "no-auth-event"
      /* AuthErrorCode.NO_AUTH_EVENT */
    )
  };
}
function _savePartialEvent(auth, event) {
  return storage()._set(persistenceKey(auth), event);
}
function _getAndRemoveEvent(auth) {
  return __async(this, null, function* () {
    const event = yield storage()._get(persistenceKey(auth));
    if (event) {
      yield storage()._remove(persistenceKey(auth));
    }
    return event;
  });
}
function _eventFromPartialAndUrl(partialEvent, url) {
  var _a, _b;
  const callbackUrl = _getDeepLinkFromCallback(url);
  if (callbackUrl.includes("/__/auth/callback")) {
    const params = searchParamsOrEmpty(callbackUrl);
    const errorObject = params["firebaseError"] ? parseJsonOrNull(decodeURIComponent(params["firebaseError"])) : null;
    const code = (_b = (_a = errorObject === null || errorObject === void 0 ? void 0 : errorObject["code"]) === null || _a === void 0 ? void 0 : _a.split("auth/")) === null || _b === void 0 ? void 0 : _b[1];
    const error = code ? _createError(code) : null;
    if (error) {
      return {
        type: partialEvent.type,
        eventId: partialEvent.eventId,
        tenantId: partialEvent.tenantId,
        error,
        urlResponse: null,
        sessionId: null,
        postBody: null
      };
    } else {
      return {
        type: partialEvent.type,
        eventId: partialEvent.eventId,
        tenantId: partialEvent.tenantId,
        sessionId: partialEvent.sessionId,
        urlResponse: callbackUrl,
        postBody: null
      };
    }
  }
  return null;
}
function generateSessionId() {
  const chars = [];
  const allowedChars = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < SESSION_ID_LENGTH; i++) {
    const idx = Math.floor(Math.random() * allowedChars.length);
    chars.push(allowedChars.charAt(idx));
  }
  return chars.join("");
}
function storage() {
  return _getInstance(browserLocalPersistence2);
}
function persistenceKey(auth) {
  return _persistenceKeyName("authEvent", auth.config.apiKey, auth.name);
}
function parseJsonOrNull(json) {
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}
function _getDeepLinkFromCallback(url) {
  const params = searchParamsOrEmpty(url);
  const link = params["link"] ? decodeURIComponent(params["link"]) : void 0;
  const doubleDeepLink = searchParamsOrEmpty(link)["link"];
  const iOSDeepLink = params["deep_link_id"] ? decodeURIComponent(params["deep_link_id"]) : void 0;
  const iOSDoubleDeepLink = searchParamsOrEmpty(iOSDeepLink)["link"];
  return iOSDoubleDeepLink || iOSDeepLink || doubleDeepLink || link || url;
}
function searchParamsOrEmpty(url) {
  if (!(url === null || url === void 0 ? void 0 : url.includes("?"))) {
    return {};
  }
  const [_, ...rest] = url.split("?");
  return querystringDecode(rest.join("?"));
}
var INITIAL_EVENT_TIMEOUT_MS = 500;
var CordovaPopupRedirectResolver = class {
  constructor() {
    this._redirectPersistence = browserSessionPersistence2;
    this._shouldInitProactively = true;
    this.eventManagers = /* @__PURE__ */ new Map();
    this.originValidationPromises = {};
    this._completeRedirectFn = _getRedirectResult;
    this._overrideRedirectResult = _overrideRedirectResult;
  }
  _initialize(auth) {
    return __async(this, null, function* () {
      const key = auth._key();
      let manager = this.eventManagers.get(key);
      if (!manager) {
        manager = new CordovaAuthEventManager(auth);
        this.eventManagers.set(key, manager);
        this.attachCallbackListeners(auth, manager);
      }
      return manager;
    });
  }
  _openPopup(auth) {
    _fail(
      auth,
      "operation-not-supported-in-this-environment"
      /* AuthErrorCode.OPERATION_NOT_SUPPORTED */
    );
  }
  _openRedirect(auth, provider, authType, eventId) {
    return __async(this, null, function* () {
      _checkCordovaConfiguration(auth);
      const manager = yield this._initialize(auth);
      yield manager.initialized();
      manager.resetRedirect();
      _clearRedirectOutcomes();
      yield this._originValidation(auth);
      const event = _generateNewEvent(auth, authType, eventId);
      yield _savePartialEvent(auth, event);
      const url = yield _generateHandlerUrl(auth, event, provider);
      const iabRef = yield _performRedirect(url);
      return _waitForAppResume(auth, manager, iabRef);
    });
  }
  _isIframeWebStorageSupported(_auth, _cb) {
    throw new Error("Method not implemented.");
  }
  _originValidation(auth) {
    const key = auth._key();
    if (!this.originValidationPromises[key]) {
      this.originValidationPromises[key] = _validateOrigin(auth);
    }
    return this.originValidationPromises[key];
  }
  attachCallbackListeners(auth, manager) {
    const {
      universalLinks,
      handleOpenURL,
      BuildInfo
    } = _cordovaWindow();
    const noEventTimeout = setTimeout(() => __async(this, null, function* () {
      yield _getAndRemoveEvent(auth);
      manager.onEvent(generateNoEvent());
    }), INITIAL_EVENT_TIMEOUT_MS);
    const universalLinksCb = (eventData) => __async(this, null, function* () {
      clearTimeout(noEventTimeout);
      const partialEvent = yield _getAndRemoveEvent(auth);
      let finalEvent = null;
      if (partialEvent && (eventData === null || eventData === void 0 ? void 0 : eventData["url"])) {
        finalEvent = _eventFromPartialAndUrl(partialEvent, eventData["url"]);
      }
      manager.onEvent(finalEvent || generateNoEvent());
    });
    if (typeof universalLinks !== "undefined" && typeof universalLinks.subscribe === "function") {
      universalLinks.subscribe(null, universalLinksCb);
    }
    const existingHandleOpenURL = handleOpenURL;
    const packagePrefix = `${BuildInfo.packageName.toLowerCase()}://`;
    _cordovaWindow().handleOpenURL = (url) => __async(this, null, function* () {
      if (url.toLowerCase().startsWith(packagePrefix)) {
        universalLinksCb({
          url
        });
      }
      if (typeof existingHandleOpenURL === "function") {
        try {
          existingHandleOpenURL(url);
        } catch (e) {
          console.error(e);
        }
      }
    });
  }
};
var cordovaPopupRedirectResolver = CordovaPopupRedirectResolver;
function generateNoEvent() {
  return {
    type: "unknown",
    eventId: null,
    sessionId: null,
    urlResponse: null,
    postBody: null,
    tenantId: null,
    error: _createError(
      "no-auth-event"
      /* AuthErrorCode.NO_AUTH_EVENT */
    )
  };
}
function addFrameworkForLogging(auth, framework) {
  _castAuth(auth)._logFramework(framework);
}

// node_modules/@angular/fire/node_modules/@firebase/auth-compat/dist/esm/index.node.esm.js
var import_undici2 = __toESM(require_undici());
var name = "@firebase/auth-compat";
var version = "0.5.14";
var CORDOVA_ONDEVICEREADY_TIMEOUT_MS = 1e3;
function _getCurrentScheme() {
  var _a;
  return ((_a = self === null || self === void 0 ? void 0 : self.location) === null || _a === void 0 ? void 0 : _a.protocol) || null;
}
function _isHttpOrHttps() {
  return _getCurrentScheme() === "http:" || _getCurrentScheme() === "https:";
}
function _isAndroidOrIosCordovaScheme(ua = getUA()) {
  return !!((_getCurrentScheme() === "file:" || _getCurrentScheme() === "ionic:" || _getCurrentScheme() === "capacitor:") && ua.toLowerCase().match(/iphone|ipad|ipod|android/));
}
function _isNativeEnvironment() {
  return isReactNative() || isNode();
}
function _isIe11() {
  return isIE() && (document === null || document === void 0 ? void 0 : document.documentMode) === 11;
}
function _isEdge(ua = getUA()) {
  return /Edge\/\d+/.test(ua);
}
function _isLocalStorageNotSynchronized(ua = getUA()) {
  return _isIe11() || _isEdge(ua);
}
function _isWebStorageSupported() {
  try {
    const storage2 = self.localStorage;
    const key = _generateEventId();
    if (storage2) {
      storage2["setItem"](key, "1");
      storage2["removeItem"](key);
      if (_isLocalStorageNotSynchronized()) {
        return isIndexedDBAvailable();
      }
      return true;
    }
  } catch (e) {
    return _isWorker() && isIndexedDBAvailable();
  }
  return false;
}
function _isWorker() {
  return typeof global !== "undefined" && "WorkerGlobalScope" in global && "importScripts" in global;
}
function _isPopupRedirectSupported() {
  return (_isHttpOrHttps() || isBrowserExtension() || _isAndroidOrIosCordovaScheme()) && // React Native with remote debugging reports its location.protocol as
  // http.
  !_isNativeEnvironment() && // Local storage has to be supported for browser popup and redirect
  // operations to work.
  _isWebStorageSupported() && // DOM, popups and redirects are not supported within a worker.
  !_isWorker();
}
function _isLikelyCordova() {
  return _isAndroidOrIosCordovaScheme() && typeof document !== "undefined";
}
function _isCordova() {
  return __async(this, null, function* () {
    if (!_isLikelyCordova()) {
      return false;
    }
    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        resolve(false);
      }, CORDOVA_ONDEVICEREADY_TIMEOUT_MS);
      document.addEventListener("deviceready", () => {
        clearTimeout(timeoutId);
        resolve(true);
      });
    });
  });
}
function _getSelfWindow() {
  return typeof window !== "undefined" ? window : null;
}
var Persistence = {
  LOCAL: "local",
  NONE: "none",
  SESSION: "session"
};
var _assert$3 = _assert;
var PERSISTENCE_KEY = "persistence";
function _validatePersistenceArgument(auth, persistence) {
  _assert$3(
    Object.values(Persistence).includes(persistence),
    auth,
    "invalid-persistence-type"
    /* exp.AuthErrorCode.INVALID_PERSISTENCE */
  );
  if (isReactNative()) {
    _assert$3(
      persistence !== Persistence.SESSION,
      auth,
      "unsupported-persistence-type"
      /* exp.AuthErrorCode.UNSUPPORTED_PERSISTENCE */
    );
    return;
  }
  if (isNode()) {
    _assert$3(
      persistence === Persistence.NONE,
      auth,
      "unsupported-persistence-type"
      /* exp.AuthErrorCode.UNSUPPORTED_PERSISTENCE */
    );
    return;
  }
  if (_isWorker()) {
    _assert$3(
      persistence === Persistence.NONE || persistence === Persistence.LOCAL && isIndexedDBAvailable(),
      auth,
      "unsupported-persistence-type"
      /* exp.AuthErrorCode.UNSUPPORTED_PERSISTENCE */
    );
    return;
  }
  _assert$3(
    persistence === Persistence.NONE || _isWebStorageSupported(),
    auth,
    "unsupported-persistence-type"
    /* exp.AuthErrorCode.UNSUPPORTED_PERSISTENCE */
  );
}
function _savePersistenceForRedirect(auth) {
  return __async(this, null, function* () {
    yield auth._initializationPromise;
    const session = getSessionStorageIfAvailable();
    const key = _persistenceKeyName(PERSISTENCE_KEY, auth.config.apiKey, auth.name);
    if (session) {
      session.setItem(key, auth._getPersistence());
    }
  });
}
function _getPersistencesFromRedirect(apiKey, appName) {
  const session = getSessionStorageIfAvailable();
  if (!session) {
    return [];
  }
  const key = _persistenceKeyName(PERSISTENCE_KEY, apiKey, appName);
  const persistence = session.getItem(key);
  switch (persistence) {
    case Persistence.NONE:
      return [inMemoryPersistence];
    case Persistence.LOCAL:
      return [indexedDBLocalPersistence, browserSessionPersistence];
    case Persistence.SESSION:
      return [browserSessionPersistence];
    default:
      return [];
  }
}
function getSessionStorageIfAvailable() {
  var _a;
  try {
    return ((_a = _getSelfWindow()) === null || _a === void 0 ? void 0 : _a.sessionStorage) || null;
  } catch (e) {
    return null;
  }
}
var _assert$2 = _assert;
var CompatPopupRedirectResolver = class {
  constructor() {
    this.browserResolver = _getInstance(browserPopupRedirectResolver);
    this.cordovaResolver = _getInstance(cordovaPopupRedirectResolver);
    this.underlyingResolver = null;
    this._redirectPersistence = browserSessionPersistence;
    this._completeRedirectFn = _getRedirectResult;
    this._overrideRedirectResult = _overrideRedirectResult;
  }
  _initialize(auth) {
    return __async(this, null, function* () {
      yield this.selectUnderlyingResolver();
      return this.assertedUnderlyingResolver._initialize(auth);
    });
  }
  _openPopup(auth, provider, authType, eventId) {
    return __async(this, null, function* () {
      yield this.selectUnderlyingResolver();
      return this.assertedUnderlyingResolver._openPopup(auth, provider, authType, eventId);
    });
  }
  _openRedirect(auth, provider, authType, eventId) {
    return __async(this, null, function* () {
      yield this.selectUnderlyingResolver();
      return this.assertedUnderlyingResolver._openRedirect(auth, provider, authType, eventId);
    });
  }
  _isIframeWebStorageSupported(auth, cb) {
    this.assertedUnderlyingResolver._isIframeWebStorageSupported(auth, cb);
  }
  _originValidation(auth) {
    return this.assertedUnderlyingResolver._originValidation(auth);
  }
  get _shouldInitProactively() {
    return _isLikelyCordova() || this.browserResolver._shouldInitProactively;
  }
  get assertedUnderlyingResolver() {
    _assert$2(
      this.underlyingResolver,
      "internal-error"
      /* exp.AuthErrorCode.INTERNAL_ERROR */
    );
    return this.underlyingResolver;
  }
  selectUnderlyingResolver() {
    return __async(this, null, function* () {
      if (this.underlyingResolver) {
        return;
      }
      const isCordova = yield _isCordova();
      this.underlyingResolver = isCordova ? this.cordovaResolver : this.browserResolver;
    });
  }
};
function unwrap(object) {
  return object.unwrap();
}
function wrapped(object) {
  return object.wrapped();
}
function credentialFromResponse(userCredential) {
  return credentialFromObject(userCredential);
}
function attachExtraErrorFields(auth, e) {
  var _a;
  const response = (_a = e.customData) === null || _a === void 0 ? void 0 : _a._tokenResponse;
  if ((e === null || e === void 0 ? void 0 : e.code) === "auth/multi-factor-auth-required") {
    const mfaErr = e;
    mfaErr.resolver = new MultiFactorResolver(auth, getMultiFactorResolver(auth, e));
  } else if (response) {
    const credential = credentialFromObject(e);
    const credErr = e;
    if (credential) {
      credErr.credential = credential;
      credErr.tenantId = response.tenantId || void 0;
      credErr.email = response.email || void 0;
      credErr.phoneNumber = response.phoneNumber || void 0;
    }
  }
}
function credentialFromObject(object) {
  const {
    _tokenResponse
  } = object instanceof FirebaseError ? object.customData : object;
  if (!_tokenResponse) {
    return null;
  }
  if (!(object instanceof FirebaseError)) {
    if ("temporaryProof" in _tokenResponse && "phoneNumber" in _tokenResponse) {
      return PhoneAuthProvider.credentialFromResult(object);
    }
  }
  const providerId = _tokenResponse.providerId;
  if (!providerId || providerId === ProviderId.PASSWORD) {
    return null;
  }
  let provider;
  switch (providerId) {
    case ProviderId.GOOGLE:
      provider = GoogleAuthProvider;
      break;
    case ProviderId.FACEBOOK:
      provider = FacebookAuthProvider;
      break;
    case ProviderId.GITHUB:
      provider = GithubAuthProvider;
      break;
    case ProviderId.TWITTER:
      provider = TwitterAuthProvider;
      break;
    default:
      const {
        oauthIdToken,
        oauthAccessToken,
        oauthTokenSecret,
        pendingToken,
        nonce
      } = _tokenResponse;
      if (!oauthAccessToken && !oauthTokenSecret && !oauthIdToken && !pendingToken) {
        return null;
      }
      if (pendingToken) {
        if (providerId.startsWith("saml.")) {
          return SAMLAuthCredential._create(providerId, pendingToken);
        } else {
          return OAuthCredential._fromParams({
            providerId,
            signInMethod: providerId,
            pendingToken,
            idToken: oauthIdToken,
            accessToken: oauthAccessToken
          });
        }
      }
      return new OAuthProvider(providerId).credential({
        idToken: oauthIdToken,
        accessToken: oauthAccessToken,
        rawNonce: nonce
      });
  }
  return object instanceof FirebaseError ? provider.credentialFromError(object) : provider.credentialFromResult(object);
}
function convertCredential(auth, credentialPromise) {
  return credentialPromise.catch((e) => {
    if (e instanceof FirebaseError) {
      attachExtraErrorFields(auth, e);
    }
    throw e;
  }).then((credential) => {
    const operationType = credential.operationType;
    const user = credential.user;
    return {
      operationType,
      credential: credentialFromResponse(credential),
      additionalUserInfo: getAdditionalUserInfo(credential),
      user: User.getOrCreate(user)
    };
  });
}
function convertConfirmationResult(auth, confirmationResultPromise) {
  return __async(this, null, function* () {
    const confirmationResultExp = yield confirmationResultPromise;
    return {
      verificationId: confirmationResultExp.verificationId,
      confirm: (verificationCode) => convertCredential(auth, confirmationResultExp.confirm(verificationCode))
    };
  });
}
var MultiFactorResolver = class {
  constructor(auth, resolver) {
    this.resolver = resolver;
    this.auth = wrapped(auth);
  }
  get session() {
    return this.resolver.session;
  }
  get hints() {
    return this.resolver.hints;
  }
  resolveSignIn(assertion) {
    return convertCredential(unwrap(this.auth), this.resolver.resolveSignIn(assertion));
  }
};
var User = class _User {
  constructor(_delegate) {
    this._delegate = _delegate;
    this.multiFactor = multiFactor(_delegate);
  }
  static getOrCreate(user) {
    if (!_User.USER_MAP.has(user)) {
      _User.USER_MAP.set(user, new _User(user));
    }
    return _User.USER_MAP.get(user);
  }
  delete() {
    return this._delegate.delete();
  }
  reload() {
    return this._delegate.reload();
  }
  toJSON() {
    return this._delegate.toJSON();
  }
  getIdTokenResult(forceRefresh) {
    return this._delegate.getIdTokenResult(forceRefresh);
  }
  getIdToken(forceRefresh) {
    return this._delegate.getIdToken(forceRefresh);
  }
  linkAndRetrieveDataWithCredential(credential) {
    return this.linkWithCredential(credential);
  }
  linkWithCredential(credential) {
    return __async(this, null, function* () {
      return convertCredential(this.auth, linkWithCredential(this._delegate, credential));
    });
  }
  linkWithPhoneNumber(phoneNumber, applicationVerifier) {
    return __async(this, null, function* () {
      return convertConfirmationResult(this.auth, linkWithPhoneNumber(this._delegate, phoneNumber, applicationVerifier));
    });
  }
  linkWithPopup(provider) {
    return __async(this, null, function* () {
      return convertCredential(this.auth, linkWithPopup(this._delegate, provider, CompatPopupRedirectResolver));
    });
  }
  linkWithRedirect(provider) {
    return __async(this, null, function* () {
      yield _savePersistenceForRedirect(_castAuth(this.auth));
      return linkWithRedirect(this._delegate, provider, CompatPopupRedirectResolver);
    });
  }
  reauthenticateAndRetrieveDataWithCredential(credential) {
    return this.reauthenticateWithCredential(credential);
  }
  reauthenticateWithCredential(credential) {
    return __async(this, null, function* () {
      return convertCredential(this.auth, reauthenticateWithCredential(this._delegate, credential));
    });
  }
  reauthenticateWithPhoneNumber(phoneNumber, applicationVerifier) {
    return convertConfirmationResult(this.auth, reauthenticateWithPhoneNumber(this._delegate, phoneNumber, applicationVerifier));
  }
  reauthenticateWithPopup(provider) {
    return convertCredential(this.auth, reauthenticateWithPopup(this._delegate, provider, CompatPopupRedirectResolver));
  }
  reauthenticateWithRedirect(provider) {
    return __async(this, null, function* () {
      yield _savePersistenceForRedirect(_castAuth(this.auth));
      return reauthenticateWithRedirect(this._delegate, provider, CompatPopupRedirectResolver);
    });
  }
  sendEmailVerification(actionCodeSettings) {
    return sendEmailVerification(this._delegate, actionCodeSettings);
  }
  unlink(providerId) {
    return __async(this, null, function* () {
      yield unlink(this._delegate, providerId);
      return this;
    });
  }
  updateEmail(newEmail) {
    return updateEmail(this._delegate, newEmail);
  }
  updatePassword(newPassword) {
    return updatePassword(this._delegate, newPassword);
  }
  updatePhoneNumber(phoneCredential) {
    return updatePhoneNumber(this._delegate, phoneCredential);
  }
  updateProfile(profile) {
    return updateProfile(this._delegate, profile);
  }
  verifyBeforeUpdateEmail(newEmail, actionCodeSettings) {
    return verifyBeforeUpdateEmail(this._delegate, newEmail, actionCodeSettings);
  }
  get emailVerified() {
    return this._delegate.emailVerified;
  }
  get isAnonymous() {
    return this._delegate.isAnonymous;
  }
  get metadata() {
    return this._delegate.metadata;
  }
  get phoneNumber() {
    return this._delegate.phoneNumber;
  }
  get providerData() {
    return this._delegate.providerData;
  }
  get refreshToken() {
    return this._delegate.refreshToken;
  }
  get tenantId() {
    return this._delegate.tenantId;
  }
  get displayName() {
    return this._delegate.displayName;
  }
  get email() {
    return this._delegate.email;
  }
  get photoURL() {
    return this._delegate.photoURL;
  }
  get providerId() {
    return this._delegate.providerId;
  }
  get uid() {
    return this._delegate.uid;
  }
  get auth() {
    return this._delegate.auth;
  }
};
User.USER_MAP = /* @__PURE__ */ new WeakMap();
var _assert$1 = _assert;
var Auth = class {
  constructor(app, provider) {
    this.app = app;
    if (provider.isInitialized()) {
      this._delegate = provider.getImmediate();
      this.linkUnderlyingAuth();
      return;
    }
    const {
      apiKey
    } = app.options;
    _assert$1(apiKey, "invalid-api-key", {
      appName: app.name
    });
    _assert$1(apiKey, "invalid-api-key", {
      appName: app.name
    });
    const resolver = typeof window !== "undefined" ? CompatPopupRedirectResolver : void 0;
    this._delegate = provider.initialize({
      options: {
        persistence: buildPersistenceHierarchy(apiKey, app.name),
        popupRedirectResolver: resolver
      }
    });
    this._delegate._updateErrorMap(debugErrorMap);
    this.linkUnderlyingAuth();
  }
  get emulatorConfig() {
    return this._delegate.emulatorConfig;
  }
  get currentUser() {
    if (!this._delegate.currentUser) {
      return null;
    }
    return User.getOrCreate(this._delegate.currentUser);
  }
  get languageCode() {
    return this._delegate.languageCode;
  }
  set languageCode(languageCode) {
    this._delegate.languageCode = languageCode;
  }
  get settings() {
    return this._delegate.settings;
  }
  get tenantId() {
    return this._delegate.tenantId;
  }
  set tenantId(tid) {
    this._delegate.tenantId = tid;
  }
  useDeviceLanguage() {
    this._delegate.useDeviceLanguage();
  }
  signOut() {
    return this._delegate.signOut();
  }
  useEmulator(url, options) {
    connectAuthEmulator(this._delegate, url, options);
  }
  applyActionCode(code) {
    return applyActionCode(this._delegate, code);
  }
  checkActionCode(code) {
    return checkActionCode(this._delegate, code);
  }
  confirmPasswordReset(code, newPassword) {
    return confirmPasswordReset(this._delegate, code, newPassword);
  }
  createUserWithEmailAndPassword(email, password) {
    return __async(this, null, function* () {
      return convertCredential(this._delegate, createUserWithEmailAndPassword(this._delegate, email, password));
    });
  }
  fetchProvidersForEmail(email) {
    return this.fetchSignInMethodsForEmail(email);
  }
  fetchSignInMethodsForEmail(email) {
    return fetchSignInMethodsForEmail(this._delegate, email);
  }
  isSignInWithEmailLink(emailLink) {
    return isSignInWithEmailLink(this._delegate, emailLink);
  }
  getRedirectResult() {
    return __async(this, null, function* () {
      _assert$1(
        _isPopupRedirectSupported(),
        this._delegate,
        "operation-not-supported-in-this-environment"
        /* exp.AuthErrorCode.OPERATION_NOT_SUPPORTED */
      );
      const credential = yield getRedirectResult(this._delegate, CompatPopupRedirectResolver);
      if (!credential) {
        return {
          credential: null,
          user: null
        };
      }
      return convertCredential(this._delegate, Promise.resolve(credential));
    });
  }
  // This function should only be called by frameworks (e.g. FirebaseUI-web) to log their usage.
  // It is not intended for direct use by developer apps. NO jsdoc here to intentionally leave it
  // out of autogenerated documentation pages to reduce accidental misuse.
  addFrameworkForLogging(framework) {
    addFrameworkForLogging(this._delegate, framework);
  }
  onAuthStateChanged(nextOrObserver, errorFn, completed) {
    const {
      next,
      error,
      complete
    } = wrapObservers(nextOrObserver, errorFn, completed);
    return this._delegate.onAuthStateChanged(next, error, complete);
  }
  onIdTokenChanged(nextOrObserver, errorFn, completed) {
    const {
      next,
      error,
      complete
    } = wrapObservers(nextOrObserver, errorFn, completed);
    return this._delegate.onIdTokenChanged(next, error, complete);
  }
  sendSignInLinkToEmail(email, actionCodeSettings) {
    return sendSignInLinkToEmail(this._delegate, email, actionCodeSettings);
  }
  sendPasswordResetEmail(email, actionCodeSettings) {
    return sendPasswordResetEmail(this._delegate, email, actionCodeSettings || void 0);
  }
  setPersistence(persistence) {
    return __async(this, null, function* () {
      _validatePersistenceArgument(this._delegate, persistence);
      let converted;
      switch (persistence) {
        case Persistence.SESSION:
          converted = browserSessionPersistence;
          break;
        case Persistence.LOCAL:
          const isIndexedDBFullySupported = yield _getInstance(indexedDBLocalPersistence)._isAvailable();
          converted = isIndexedDBFullySupported ? indexedDBLocalPersistence : browserLocalPersistence;
          break;
        case Persistence.NONE:
          converted = inMemoryPersistence;
          break;
        default:
          return _fail("argument-error", {
            appName: this._delegate.name
          });
      }
      return this._delegate.setPersistence(converted);
    });
  }
  signInAndRetrieveDataWithCredential(credential) {
    return this.signInWithCredential(credential);
  }
  signInAnonymously() {
    return convertCredential(this._delegate, signInAnonymously(this._delegate));
  }
  signInWithCredential(credential) {
    return convertCredential(this._delegate, signInWithCredential(this._delegate, credential));
  }
  signInWithCustomToken(token) {
    return convertCredential(this._delegate, signInWithCustomToken(this._delegate, token));
  }
  signInWithEmailAndPassword(email, password) {
    return convertCredential(this._delegate, signInWithEmailAndPassword(this._delegate, email, password));
  }
  signInWithEmailLink(email, emailLink) {
    return convertCredential(this._delegate, signInWithEmailLink(this._delegate, email, emailLink));
  }
  signInWithPhoneNumber(phoneNumber, applicationVerifier) {
    return convertConfirmationResult(this._delegate, signInWithPhoneNumber(this._delegate, phoneNumber, applicationVerifier));
  }
  signInWithPopup(provider) {
    return __async(this, null, function* () {
      _assert$1(
        _isPopupRedirectSupported(),
        this._delegate,
        "operation-not-supported-in-this-environment"
        /* exp.AuthErrorCode.OPERATION_NOT_SUPPORTED */
      );
      return convertCredential(this._delegate, signInWithPopup(this._delegate, provider, CompatPopupRedirectResolver));
    });
  }
  signInWithRedirect(provider) {
    return __async(this, null, function* () {
      _assert$1(
        _isPopupRedirectSupported(),
        this._delegate,
        "operation-not-supported-in-this-environment"
        /* exp.AuthErrorCode.OPERATION_NOT_SUPPORTED */
      );
      yield _savePersistenceForRedirect(this._delegate);
      return signInWithRedirect(this._delegate, provider, CompatPopupRedirectResolver);
    });
  }
  updateCurrentUser(user) {
    return this._delegate.updateCurrentUser(user);
  }
  verifyPasswordResetCode(code) {
    return verifyPasswordResetCode(this._delegate, code);
  }
  unwrap() {
    return this._delegate;
  }
  _delete() {
    return this._delegate._delete();
  }
  linkUnderlyingAuth() {
    this._delegate.wrapped = () => this;
  }
};
Auth.Persistence = Persistence;
function wrapObservers(nextOrObserver, error, complete) {
  let next = nextOrObserver;
  if (typeof nextOrObserver !== "function") {
    ({
      next,
      error,
      complete
    } = nextOrObserver);
  }
  const oldNext = next;
  const newNext = (user) => oldNext(user && User.getOrCreate(user));
  return {
    next: newNext,
    error,
    complete
  };
}
function buildPersistenceHierarchy(apiKey, appName) {
  const persistences = _getPersistencesFromRedirect(apiKey, appName);
  if (typeof self !== "undefined" && !persistences.includes(indexedDBLocalPersistence)) {
    persistences.push(indexedDBLocalPersistence);
  }
  if (typeof window !== "undefined") {
    for (const persistence of [browserLocalPersistence, browserSessionPersistence]) {
      if (!persistences.includes(persistence)) {
        persistences.push(persistence);
      }
    }
  }
  if (!persistences.includes(inMemoryPersistence)) {
    persistences.push(inMemoryPersistence);
  }
  return persistences;
}
var PhoneAuthProvider2 = class {
  constructor() {
    this.providerId = "phone";
    this._delegate = new PhoneAuthProvider(unwrap(firebase.auth()));
  }
  static credential(verificationId, verificationCode) {
    return PhoneAuthProvider.credential(verificationId, verificationCode);
  }
  verifyPhoneNumber(phoneInfoOptions, applicationVerifier) {
    return this._delegate.verifyPhoneNumber(
      // The implementation matches but the types are subtly incompatible
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      phoneInfoOptions,
      applicationVerifier
    );
  }
  unwrap() {
    return this._delegate;
  }
};
PhoneAuthProvider2.PHONE_SIGN_IN_METHOD = PhoneAuthProvider.PHONE_SIGN_IN_METHOD;
PhoneAuthProvider2.PROVIDER_ID = PhoneAuthProvider.PROVIDER_ID;
var _assert2 = _assert;
var RecaptchaVerifier2 = class {
  constructor(container, parameters, app = firebase.app()) {
    var _a;
    _assert2((_a = app.options) === null || _a === void 0 ? void 0 : _a.apiKey, "invalid-api-key", {
      appName: app.name
    });
    this._delegate = new RecaptchaVerifier(
      // TODO: remove ts-ignore when moving types from auth-types to auth-compat
      // @ts-ignore
      app.auth(),
      container,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parameters
    );
    this.type = this._delegate.type;
  }
  clear() {
    this._delegate.clear();
  }
  render() {
    return this._delegate.render();
  }
  verify() {
    return this._delegate.verify();
  }
};
var AUTH_TYPE = "auth-compat";
function registerAuthCompat(instance) {
  instance.INTERNAL.registerComponent(new Component(
    AUTH_TYPE,
    (container) => {
      const app = container.getProvider("app-compat").getImmediate();
      const authProvider = container.getProvider("auth");
      return new Auth(app, authProvider);
    },
    "PUBLIC"
    /* ComponentType.PUBLIC */
  ).setServiceProps({
    ActionCodeInfo: {
      Operation: {
        EMAIL_SIGNIN: ActionCodeOperation.EMAIL_SIGNIN,
        PASSWORD_RESET: ActionCodeOperation.PASSWORD_RESET,
        RECOVER_EMAIL: ActionCodeOperation.RECOVER_EMAIL,
        REVERT_SECOND_FACTOR_ADDITION: ActionCodeOperation.REVERT_SECOND_FACTOR_ADDITION,
        VERIFY_AND_CHANGE_EMAIL: ActionCodeOperation.VERIFY_AND_CHANGE_EMAIL,
        VERIFY_EMAIL: ActionCodeOperation.VERIFY_EMAIL
      }
    },
    EmailAuthProvider,
    FacebookAuthProvider,
    GithubAuthProvider,
    GoogleAuthProvider,
    OAuthProvider,
    SAMLAuthProvider,
    PhoneAuthProvider: PhoneAuthProvider2,
    PhoneMultiFactorGenerator,
    RecaptchaVerifier: RecaptchaVerifier2,
    TwitterAuthProvider,
    Auth,
    AuthCredential,
    Error: FirebaseError
  }).setInstantiationMode(
    "LAZY"
    /* InstantiationMode.LAZY */
  ).setMultipleInstances(false));
  instance.registerVersion(name, version);
}
registerAuthCompat(firebase);
FetchProvider.initialize(import_undici2.fetch, import_undici2.Headers, import_undici2.Response);
/*! Bundled license information:

@firebase/auth/dist/node-esm/internal.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/node-esm/internal.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth-compat/dist/esm/index.node.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
//# sourceMappingURL=chunk-XXKSDO26.js.map
