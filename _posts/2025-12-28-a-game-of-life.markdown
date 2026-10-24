---
layout: post
title:  "A (Not-So-Fun) Game of Life"
date:   2025-12-28
categories: career life-lesson
---

# {{ page.title }}

<span class="date">{{ page.date | date: "%B %d, %Y" }}</span>

<link rel="stylesheet" href="{{ '/assets/css/life-game.css' | relative_url }}">

I subscribe to neither determinism nor fatalism, but I do believe that each of us are only presented with a finite number of choices (albet astronomical in total) during different points of our life.

The way I visualize it is like an extremely complex [Alluvial diagram](https://en.wikipedia.org/wiki/Alluvial_diagram){:target="_blank" rel="noopener noreferrer"}. Due to the [butterfly effect](https://en.wikipedia.org/wiki/Butterfly_effect){:target="_blank" rel="noopener noreferrer"}, for example, my life could play out differently if I were to take the 10:30 AM bus instead of the one at 10 AM... causing me to be late to an event, not hearing an important announcement, and missing out on an opportunity that could change the course of my career.

Of course, there's no way to test this, since I could only experience and observe one outcome, but hopefully you get the gist.

With this model, the hardest part that I had to come to terms with is that there's seemingly no way to tell what causes what. Aside from major clusters of predetermined factors like birthplace, family wealth, biological traits, etc., most events that take place after one's birth are decided by a myriad of factors that's largely outside of the person's control.

So, to simulate this idea, I came up with a perhaps not-so-fun game. You roll a die to decide where you start in life and how you proceed through the different stages. Each roll will determine the level of satisfaction you experience at a certain life stage. You're also 1/3 less likely to move up if you're already at the bottom of the barrel, and vice versa, if you've already reached the top.

Use the interactive version below to play, or [download the hi-res version]({{ '/assets/img/blog/life-vis.png' | relative_url }}){:target="_blank" rel="noopener noreferrer"} of the original diagram.

<div class="life-game">
  <div
    id="life-visualization"
    class="life-visualization"
    role="img"
    aria-label="Life satisfaction paths across youth, adulthood, and elderly life stages"
  ></div>
  <section class="game-panel" aria-labelledby="game-title">
    <div class="game-copy">
      <p class="eyebrow">Your journey</p>
      <h2 id="game-title">Roll through life</h2>
      <p id="game-status" class="game-status" aria-live="polite">
        Roll the die to choose your starting satisfaction level.
      </p>
    </div>
    <div class="game-actions">
      <div id="die" class="die" aria-label="Die has not been rolled">?</div>
      <button id="roll-button" class="button button-primary" type="button">
        Roll to start
      </button>
      <button id="reset-button" class="button button-secondary" type="button">
        Reset
      </button>
    </div>
    <div id="choice-panel" class="choice-panel" hidden>
      <span>Choose your starting level:</span>
      <div id="choice-buttons" class="choice-buttons"></div>
    </div>
    <ol id="roll-history" class="roll-history" aria-label="Roll history"></ol>
  </section>
</div>

<noscript>
  <img src="{{ '/assets/img/blog/life-vis.png' | relative_url }}" alt="A game-of-life diagram showing paths through seven life stages">
</noscript>

<script src="{{ '/assets/js/life-game.js' | relative_url }}" defer></script>

Step 1: Roll a six-sided die to decide where you start

- Start from the right, e.g., if you roll 5 you start from the top
- You can choose any starting point if you roll 6
- Follow the line based on what you roll in Step 2

Step 2: Roll a die to decide how you proceed

- 1-2: go downward (solid); go straight if you hit the bottom edge
- 3-4: go straight (dotted)
- 5-6: go upward (dashed); go straight if you hit the top edge

After playing a dozen rounds, it's striking how much this simple game reflects the calcification of socioeconomic class in real life. If I rolled a good start, it's difficult to be significantly worse off throughout the rest of the life stages. These outcomes match my observation of people life trajectories the years: People who came from well-off families have only amassed more wealth over the years, and others who struggled in the past are still fighting an uphill battle to this day.

This led me to a second conclusion: The range of diverging paths that people have access to are considerably influenced by their starting points. People who are born into excellent circumstances would have to be extremely unlucky to fall into destitution—if we moved beyond the randomized aspect, I'd also wager that the stronger start shields them from the negative extent of any poor life choices.

Give this game a try. You might be surprised by the outcomes.
