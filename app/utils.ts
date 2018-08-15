// функцию которую нужно вызвать
type callbackFunction = () => void;

// позволяет запустить переданную функцию только один раз
export function runOnce(): (fn: callbackFunction) => void {
    let run = false;
    return function (fn: callbackFunction) {
        if (!run) {
            fn();
            run = true;
        }
    };
}
