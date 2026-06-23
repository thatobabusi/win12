# Tiriso

> 🌐 English: [../en/usage.md](../en/usage.md)

Tsamaiso e khutshwane ya go dirisa desktop ya win12 fa e sena go simologa.

---

## Go tshwaologa le go tsena

1. Bula motheo wa saete — skrine sa boot se itiragalela (~2s).
2. Tobetsa **F2** ka nako ya boot go tsena mo skrineng sa BIOS/SETUP (ka kgetho).
3. Mo skrineng sa login, tlhopha puo (lenaane le le kwa tlase ka fa letsogong la moja)
   fa o batla, morago tobetsa **Login**. Khurumelo e a nyelela mme desktop e a bonala.
4. Go tlola login ka nako ya tlhabololo, oketsa `?skip_login=1`.

---

## Metheo ya desktop

| Tiro | Ka mokgwa |
|------|-----------|
| Bula app | Tobetsa gabedi chwantsho ya desktop, kgotsa dirisa taskbar / Start |
| Menu ya go tobetsa ka molema | Tobetsa ka molema mo desktop e e se nang sepe → Refresh, Toggle Theme, Personalization, jj. |
| Sutisa lefesetere | Goga bara ya setlhogo sa lona |
| Di-app tse di dirang | Di bonala mo dock ya taskbar e e bogareng (e bonala fela fa sengwe se butswe) |
| Fetola puo | App ya Settings, kgotsa lenaane la dipuo la skrine sa login |

---

## Di-app

Di-app tse di mo teng di akaretsa Settings, File Explorer, Microsoft Edge, Calculator,
Notepad, Terminal, Store, Camera, Whiteboard, Defender, Word, Copilot, sebadisi sa
ditshwantsho, sebapadisi sa media, mokwadi wa khoutu, le metshameko (sk. Minesweeper).
Go nna teng go ka farologana fa fork e ntse e gola.

---

## Dikgakololo

- **Sengwe se lebega se senyegile (dichwantsho di tlhaela, login e bonala ka fa morago)?**
  Gantsi ke service worker e e fetileng nako. Reloda gabedi, kgotsa laisa ka `?develop=1`.
  Bona [Thulaganyo](configuration.md#service-worker).
- **O fetola khoutu?** Dirisa `?develop=1` gore service worker e se go neele difaele tsa cache.
- **O baakanya boemo (state)?** Boemo jwa app bo mo `localStorage`; go phimola data ya
  saete go busetsa desktop, puo, le thim sešwa.
