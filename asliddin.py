import sys
try:
    import pygame
except Exception:
    print("Pygame not found. Install with: pip install -r requirements.txt")
    sys.exit(1)

import random


class Splash:
    def __init__(self, pos, color=None):
        self.x, self.y = pos
        self.color = color or (random.randint(80, 255), random.randint(80, 255), random.randint(80, 255))
        self.radius = 0.0
        self.max_radius = 220.0
        self.alpha = 220
        self.growing = True
        self.fading = False

    def start_release(self):
        self.growing = False
        self.fading = True

    def update(self, dt, mouse_down):
        if self.growing and mouse_down:
            self.radius = min(self.max_radius, self.radius + 400.0 * dt)
            self.alpha = 220
        else:
            # when not growing, start fading
            self.growing = False
            self.radius += 120.0 * dt
            self.alpha -= int(360.0 * dt)
        return self.alpha > 6

    def draw(self, surface):
        if self.alpha <= 0 or self.radius <= 0:
            return
        r = max(1, int(self.radius))
        surf = pygame.Surface((r * 2, r * 2), pygame.SRCALPHA)
        # radial gradient (approx)
        for i in range(r, 0, -1):
            a = int(self.alpha * (i / r) * 0.85)
            if a <= 0:
                continue
            col = (self.color[0], self.color[1], self.color[2], a)
            pygame.draw.circle(surf, col, (r, r), i)
        surface.blit(surf, (int(self.x - r), int(self.y - r)), special_flags=pygame.BLEND_RGBA_ADD)


def main():
    pygame.init()
    size = (1280, 720)
    screen = pygame.display.set_mode(size, pygame.RESIZABLE)
    pygame.display.set_caption("asliddin — paint splashes (click and hold)")

    clock = pygame.time.Clock()
    running = True
    splashes = []
    mouse_down = False

    # hide mouse cursor? keep visible so user can click

    while running:
        dt = clock.tick(60) / 1000.0

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    running = False
            elif event.type == pygame.MOUSEBUTTONDOWN:
                if event.button == 1:
                    mouse_down = True
                    pos = pygame.mouse.get_pos()
                    spl = Splash(pos)
                    splashes.append(spl)
            elif event.type == pygame.MOUSEBUTTONUP:
                if event.button == 1:
                    mouse_down = False
                    # tell all current splashes to start fading
                    for s in splashes:
                        s.start_release()
            elif event.type == pygame.VIDEORESIZE:
                size = (event.w, event.h)
                screen = pygame.display.set_mode(size, pygame.RESIZABLE)

        # update splashes; if mouse is down and mouse moves, create follow-up splash
        if mouse_down:
            # create trailing splash while holding and moving
            if pygame.mouse.get_rel() != (0, 0):
                pos = pygame.mouse.get_pos()
                splashes.append(Splash(pos))

        # clear to black
        screen.fill((0, 0, 0))

        # update and draw
        alive = []
        for s in splashes:
            alive_flag = s.update(dt, mouse_down)
            s.draw(screen)
            if alive_flag:
                alive.append(s)
        splashes = alive

        pygame.display.flip()

    pygame.quit()


if __name__ == '__main__':
    main()
