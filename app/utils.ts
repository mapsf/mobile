export function runOnce() {
    let run = false;
    return function (fn) {
        if (!run) {
            fn();
            run = true;
        }
    };
}
