#!/opt/homebrew/bin/python3

import pygame
import time
import random

W_X = 720
W_Y = 480

BLACK = pygame.Color(0, 0, 0)
WHITE = pygame.Color(255, 255, 255)
RED = pygame.Color(255, 0, 0)
GREEN = pygame.Color(0, 255, 0)
BLUE = pygame.Color(0, 0, 255)

pygame.init()

GAME_WINDOW = pygame.display.set_mode((W_X, W_Y))

FPS = pygame.time.Clock()

SNAKE_POS = [100, 50]

SNAKE_BODY = [
    [100, 50],
    [90, 50],
    [80, 50],
    [70, 50],
]

FOOD_POS = [
    random.randrange(1, (W_X // 10)) * 10,
    random.randrange(1, (W_Y // 10)) * 10,
]

SNAKE_SPEED = 15

FOOD_SPAWN = True
DIR = 'RIGHT'
global NEXT_DIR
NEXT_DIR = DIR

SCORE = 0

FONT = 'monospace'

F_SIZE = 10

COLOR = GREEN

def render_score():
    score_font = pygame.font.SysFont(FONT, F_SIZE)
    score_surface = score_font.render('Score: ' + str(SCORE), True, COLOR)
    score_rect = score_surface.get_rect()
    GAME_WINDOW.blit(score_surface, score_rect)

def game_over():
    font = pygame.font.SysFont(FONT, F_SIZE)
    go_surface = font.render('Score: ' + str(SCORE), True, RED)
    go_rect = go_surface.get_rect()
    go_rect.midtop = (W_X / 2, W_Y / 4)
    GAME_WINDOW.blit(go_surface, go_rect)

    pygame.display.flip()

    time.sleep(2)
    pygame.quit()
    quit()

while True:
    for event in pygame.event.get():
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_UP:
                NEXT_DIR = 'UP'
            elif event.key == pygame.K_DOWN:
                NEXT_DIR = 'DOWN'
            elif event.key == pygame.K_LEFT:
                NEXT_DIR = 'LEFT'
            elif event.key == pygame.K_RIGHT:
                NEXT_DIR = 'RIGHT'

    if NEXT_DIR == 'UP' and DIR != 'DOWN':
        DIR = 'UP'
    if NEXT_DIR == 'DOWN' and DIR != 'UP':
        DIR = 'DOWN'
    if NEXT_DIR == 'LEFT' and DIR != 'RIGHT':
        DIR = 'LEFT'
    if NEXT_DIR == 'RIGHT' and DIR != 'LEFT':
        DIR = 'RIGHT'

    if DIR == 'UP':
        SNAKE_POS[1] -= 10
    if DIR == 'DOWN':
        SNAKE_POS[1] += 10
    if DIR == 'LEFT':
        SNAKE_POS[0] -= 10
    if DIR == 'RIGHT':
        SNAKE_POS[0] += 10

    SNAKE_BODY.insert(0, list(SNAKE_POS))

    if SNAKE_POS[0] == FOOD_POS[0] and SNAKE_POS[1] == FOOD_POS[1]:
        SCORE += 10
        FOOD_SPAWN = False
    else:
        SNAKE_BODY.pop()

    if not FOOD_SPAWN:
        FOOD_POS = [
            random.randrange(1, (W_X // 10)) * 10,
            random.randrange(1, (W_Y // 10)) * 10
        ]

    FOOD_SPAWN = True
    GAME_WINDOW.fill(BLACK)

    for pos in SNAKE_BODY:
        pygame.draw.rect(
            GAME_WINDOW, WHITE, pygame.Rect(
                pos[0],
                pos[1],
                10,
                10,
            )
        )

    pygame.draw.rect(
        GAME_WINDOW, WHITE, pygame.Rect(
            FOOD_POS[0],
            FOOD_POS[1],
            10,
            10,
        )
    )

    if SNAKE_POS[0] < 0 or SNAKE_POS[0] > W_X-10:
        game_over()
    if SNAKE_POS[1] < 0 or SNAKE_POS[1] > W_Y-10:
        game_over()
    
    for block in SNAKE_BODY[1:]:
        if SNAKE_POS[0] == block[0] and SNAKE_POS[1] == block[1]:
            game_over()

    render_score()

    pygame.display.update()

    FPS.tick(SNAKE_SPEED)


