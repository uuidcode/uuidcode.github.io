#!/usr/bin/env swift

// shift+f1 ~ shift+f6 을 맥 전역 단축키로 등록하고, 눌릴 때마다 stdout 으로 이름을 한 줄씩 내보낸다.
// Carbon 의 RegisterEventHotKey 는 손쉬운 사용(Accessibility) 권한 없이도 동작하고,
// 등록된 키는 다른 앱에 전달되지 않으므로 어느 앱을 쓰는 중이든 가로챌 수 있다.
import AppKit
import Carbon

let hotKeySignature = OSType(0x55554944) // 'UUID'

// id 는 RegisterEventHotKey 에 넘긴 값 그대로 돌아온다.
let hotKeyNameMap: [UInt32: String] = [
    1: "f1",
    2: "f2",
    3: "f3",
    4: "f4",
    5: "f5",
    6: "f6"
]

var hotKeyRefList: [EventHotKeyRef?] = []

func emit(_ name: String) {
    print(name)

    fflush(stdout)
}

func handleHotKey(event: EventRef?) -> OSStatus {
    var hotKeyID = EventHotKeyID()

    let status = GetEventParameter(
        event,
        EventParamName(kEventParamDirectObject),
        EventParamType(typeEventHotKeyID),
        nil,
        MemoryLayout<EventHotKeyID>.size,
        nil,
        &hotKeyID
    )

    if status == noErr, let name = hotKeyNameMap[hotKeyID.id] {
        emit(name)
    }

    return noErr
}

var eventTypeSpec = EventTypeSpec(
    eventClass: OSType(kEventClassKeyboard),
    eventKind: UInt32(kEventHotKeyPressed)
)

InstallEventHandler(
    GetApplicationEventTarget(),
    { (_, event, _) -> OSStatus in handleHotKey(event: event) },
    1,
    &eventTypeSpec,
    nil,
    nil
)

func register(keyCode: Int, id: UInt32) {
    var hotKeyRef: EventHotKeyRef?

    let hotKeyID = EventHotKeyID(signature: hotKeySignature, id: id)

    // f1 ~ f5 맨키는 받아쓰기, 키보드 밝기 등 시스템이 먼저 가져가고
    // cmd+f5 는 VoiceOver 가 쓰므로, shift 를 함께 눌러야 하는 조합으로 등록한다.
    let status = RegisterEventHotKey(
        UInt32(keyCode),
        UInt32(shiftKey), // modifiers
        hotKeyID,
        GetApplicationEventTarget(),
        0, // options
        &hotKeyRef
    )

    if status != noErr {
        fputs("failed to register hotkey id \(id): \(status)\n", stderr)

        return
    }

    hotKeyRefList.append(hotKeyRef)
}

register(keyCode: kVK_F1, id: 1)
register(keyCode: kVK_F2, id: 2)
register(keyCode: kVK_F3, id: 3)
register(keyCode: kVK_F4, id: 4)
register(keyCode: kVK_F5, id: 5)
register(keyCode: kVK_F6, id: 6)

if hotKeyRefList.isEmpty {
    fputs("no hotkey registered\n", stderr)
    exit(3)
}

// 부모(자바) 프로세스가 사라지면 단축키만 남아 돌지 않도록 같이 끝낸다.
// 부모 pid 는 첫 번째 인자로 받는다.
if CommandLine.arguments.count >= 2, let parentPid = Int32(CommandLine.arguments[1]) {
    Timer.scheduledTimer(withTimeInterval: 2.0, repeats: true) { _ in
        if kill(parentPid, 0) != 0 {
            exit(0)
        }
    }
}

// Dock 과 메뉴 막대에 나타나지 않는 보조 앱으로 띄워 이벤트 루프만 돌린다.
NSApplication.shared.setActivationPolicy(.accessory)
NSApplication.shared.run()
