(function(){
  var FEED_URL = 'https://feeds.behold.so/o5Xtl8pul5RyElqaoXnU';
  function hydrate(){
    var slots = document.querySelectorAll('a[data-reel-slot]');
    if (!slots.length) return;
    fetch(FEED_URL, { cache: 'no-store' })
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(data){
        if (!data || !data.posts) return;
        var reels = data.posts.filter(function(p){ return p.isReel && p.thumbnailUrl && p.permalink; });
        if (!reels.length) return;
        slots.forEach(function(a, i){
          var post = reels[i];
          if (!post) return;
          a.href = post.permalink;
          var img = a.querySelector('img[data-reel-thumb]');
          if (img) {
            img.onload = function(){ img.style.opacity = '1'; };
            img.src = post.thumbnailUrl;
            img.alt = post.prunedCaption || 'Instagram reel by @ruru.work50';
          }
          var capEl = a.querySelector('[data-reel-caption]');
          if (capEl) {
            var cap = (post.prunedCaption || '').trim();
            if (cap) capEl.textContent = cap.length > 32 ? cap.slice(0, 32) + '…' : cap;
          }
          var tagsEl = a.querySelector('[data-reel-tags]');
          if (tagsEl) {
            var tags = (post.hashtags || []).slice(0, 3).map(function(t){ return '#' + t; });
            if (tags.length) tagsEl.textContent = tags.join(' ');
          }
        });
      })
      .catch(function(){ /* keep static fallback */ });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hydrate);
  } else {
    hydrate();
  }
})();
