import cv2
import numpy as np
import time
import random

# Initialize the webcam
cap = cv2.VideoCapture(0)  # 0 = default camera

# Initialize the QRCode detector
qr_detector = cv2.QRCodeDetector()

game_state = 'idle'
ret, frame = cap.read()  # Read frame from webcam

def generate_array_with_inversions(size, target_inversions):
    arr = list(range(1, size + 1))  # Sorted array with no inversions
    inversions = 0

    while inversions < target_inversions:
        candidates = []
        for i in range(size - 1):
            if arr[i] < arr[i + 1]:
                candidates.append(i)
        i = candidates[random.randint(0, len(candidates) - 1)]
        arr[i], arr[i + 1] = arr[i + 1], arr[i]
        inversions += 1

    return arr

def count_inversions(arr):
    count = 0
    n = len(arr)
    for i in range(n):
        for j in range(i + 1, n):
            if arr[i] > arr[j]:
                count += 1

    return count

# for i in range(3, 20):
#     n = i * (i - 1) // 2
#     for j in range(1, n + 1):
#         arr = generate_array_with_inversions(i, j)
#         print(count_inversions(arr), arr)
# exit()

target_inversions = 2

while True:
    # Press 'q' to exit
    key = cv2.waitKey(1) & 0xFF
    if key == ord('q'):
        break
    frame.fill(0)
    if game_state == 'idle':
        cv2.putText(frame, 'Press s to start', (100, 100), cv2.FONT_HERSHEY_SIMPLEX, 2, (255, 255, 255), 2, cv2.LINE_AA)
        cv2.imshow('Sort the codes', frame)
        if key == ord('s'):
            game_state = 'start'
            last_time = None
            players = {}
    elif game_state == 'start':
        ret, frame = cap.read()  # Read frame from webcam
        if not ret:
            print('camera return false')
            break  # Stop if the camera fails
        frame = cv2.flip(frame, 1)

        # Detect and decode multiple QR codes
        retval, decoded_texts, points, _ = qr_detector.detectAndDecodeMulti(frame)
        if retval and points is not None:
            for i, qr_code_region in enumerate(points):
                qr_code_region = np.array(qr_code_region, dtype=np.int32)
                if decoded_texts[i]:
                    players.setdefault(decoded_texts[i], {})["qr_code_region"] = qr_code_region
                else:
                    cv2.polylines(frame, [qr_code_region], isClosed=True, color=(0, 0, 255), thickness=3)
        if len(players) >= 3 and last_time is None:
            last_time = time.time()
        for player in players.values():
            # Draw a green bounding box around each QR code
            cv2.polylines(frame, [player['qr_code_region']], isClosed=True, color=(0, 255, 0), thickness=3)

        cv2.putText(frame, f'{len(players)} Players hold QR code in front of camera', (0, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 3, cv2.LINE_AA)

        if last_time is not None:
            current_time = time.time()
            count_down = int(30 - (current_time - last_time))
            cv2.putText(frame, str(count_down), (800, 120), cv2.FONT_HERSHEY_SIMPLEX, 3, (255, 255, 255), 4, cv2.LINE_AA)
            cv2.putText(frame, f'Press s to start', (0, 300), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 3, cv2.LINE_AA)
            if count_down <= 0 or count_down < 28 and key == ord('s'):
                game_state = 'init'
                n = len(players)
                n = n * (n - 1) // 2
                if target_inversions > n:
                    target_inversions = n
        cv2.imshow("Sort the codes", frame)
    elif game_state == 'init':
        cv2.putText(frame, f'Number of players: {len(players)}', (0, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 3, cv2.LINE_AA)
        n = len(players)
        n = n * (n - 1) // 2
        cv2.putText(frame, f'How many inversions would you like? (1-{n}): {target_inversions}', (0, 300), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 3, cv2.LINE_AA)
        cv2.putText(frame, f'Press + or - to adjust.  Press s to start.', (0, 500), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 3, cv2.LINE_AA)
        if key == ord('s'):
            inversions = target_inversions
            tries = 0
            game_state = 'hint'
            last_time = time.time()
            sorted_players = sorted(players.items(), key=lambda p: min(p[1]["qr_code_region"][:, 0]))
            arr = generate_array_with_inversions(len(players), target_inversions)
            for i, (text, player) in enumerate(sorted_players):
                players[text]['num'] = arr[i]
            print(arr, players)
        elif key == ord('-'):
            if target_inversions > 1:
                target_inversions -= 1
        elif key == ord('+'):
            if target_inversions < n:
                target_inversions += 1
        cv2.imshow("Sort the codes", frame)
    elif game_state == 'hint':
        cv2.putText(frame, f'Number of inversions: {inversions}', (0, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 3, cv2.LINE_AA)
        cv2.putText(frame, f'Number of tries: {tries}', (0, 200), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 3, cv2.LINE_AA)
        cv2.putText(frame, f'Swap two students and see the difference!', (0, 300), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 3, cv2.LINE_AA)
        current_time = time.time()
        count_down = int(30 - (current_time - last_time))
        cv2.putText(frame, str(count_down), (400, 400), cv2.FONT_HERSHEY_SIMPLEX, 3, (255, 255, 255), 4, cv2.LINE_AA)
        cv2.putText(frame, f'Press s to skip', (0, 500), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 3, cv2.LINE_AA)
        if count_down <= 0 or count_down < 28 and key == ord('s'):
            game_state = 'scan'
            for text in players:
                del players[text]['qr_code_region']
        cv2.imshow("Sort the codes", frame)
    elif game_state == 'scan':
        ret, frame = cap.read()  # Read frame from webcam
        if not ret:
            print('camera return false')
            break  # Stop if the camera fails
        frame = cv2.flip(frame, 1)

        # Detect and decode multiple QR codes
        retval, decoded_texts, points, _ = qr_detector.detectAndDecodeMulti(frame)
        if retval and points is not None:
            for i, qr_code_region in enumerate(points):
                qr_code_region = np.array(qr_code_region, dtype=np.int32)
                if decoded_texts[i]:
                    if decoded_texts[i] in players:
                        players[decoded_texts[i]]['qr_code_region'] = qr_code_region
                else:
                    cv2.polylines(frame, [qr_code_region], isClosed=True, color=(0, 0, 255), thickness=3)

        count = 0
        for player in players.values():
            if 'qr_code_region' in player:
                count += 1
                # Draw a green bounding box around each QR code
                cv2.polylines(frame, [player['qr_code_region']], isClosed=True, color=(0, 255, 0), thickness=3)

        cv2.putText(frame, f'Scanned {count}/{len(players)}', (0, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 3, cv2.LINE_AA)
        if count == len(players):
            tries += 1
            sorted_players = sorted(players.items(), key=lambda p: min(p[1]["qr_code_region"][:, 0]))
            arr = []
            for i, (text, player) in enumerate(sorted_players):
                arr.append(players[text]['num'])
            inversions = count_inversions(arr);
            print(inversions, arr)
            if inversions == 0:
                game_state = 'done'
            else:
                game_state = 'hint'
                last_time = time.time()
        # Show live camera feed with detected QR codes and decoded text
        cv2.imshow("Sort the codes", frame)
    elif game_state == 'done':
        cv2.putText(frame, f'Congratulations!', (0, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 3, cv2.LINE_AA)
        cv2.putText(frame, f'{len(players)} students sorted in {tries} tries.', (0, 300), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 3, cv2.LINE_AA)
        cv2.putText(frame, f'Press q for another round.', (0, 500), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 3, cv2.LINE_AA)
        cv2.imshow("Sort the codes", frame)

# Release resources
cap.release()
cv2.destroyAllWindows()
