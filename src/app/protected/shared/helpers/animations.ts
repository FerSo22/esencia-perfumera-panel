import {
    animate,
    state,
    style,
    transition,
    trigger
} from "@angular/animations";

export const fadeInOut = trigger("fadeInOut", [
    transition(
        ":enter",
        [
            style({
                opacity: 0
            }),
            animate(
                "500ms",
                style({
                    opacity: 1
                })
            )
        ]
    ),
    transition(
        ":leave",
        [
            style({
                opacity: 1
            }),
            animate(
                "200ms",
                style({
                    opacity: 0
                })
            )
        ]
    )
]);

export const submenu = trigger("submenu", [
    state(
        "hidden",
        style({
            height: "0",
            overflow: "hidden"
        })
    ),
    state(
        "visible",
        style({
            height: "*"
        })
    ),
    transition(
        "visible <=> hidden",
        [
            style({
                overflow: "hidden"
            }),
            animate("{{ transitionParams }}")
        ]
    ),
    transition(
        "void => *",
        animate(0)
    )
]);