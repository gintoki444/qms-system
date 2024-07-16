import React from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import moment from 'moment';
// import logo from '../../../assets/images/logo.png';  // สมมติว่าคุณมีโลโก้ในโปรเจคของคุณ

const logoBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGoAAABeCAYAAADLyoEsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFuoAABbqAeWOQxAAADXOSURBVHhe7b0HeFbF9j2cN29C711FQX+267Vc8VoAC0jvhBICIST0pnQQQRALKgjSewcBpSkKSO+EJr2ElkoSSCG9t/Vfa05eCahXgtfvuz5PdhxOnzNnr9l7rz1nzqtTgfxNBPck2abksGTx3yxt5YBrQFZONjJN4bp2moM8lqPzeAWXmdzOyK2BW8jJTudGttmXYp1uVaYVLQvkV5IvoIRCTrYUbSAwIGgtw6g/i6BlUtE8T2A5FM6lVjN5fo6O8Roias7TaQLYql4nakU7CuRuySdQBCKL1qAiy6CqBVaGCo9ncpmenomU5AzExaQjPj4daVzPyMwy1iOMDDoGKNZ1G0VWb2Cz9hXIryQfQNF2cqjMLCpTVpWZgqyMJLNfxpCUko5Dx65j3CffwNt7Opo0GY/mzT5D797zMH3BLviHp9Hb0fXR5WUL6Jx01kor1D7VyW3CnHuvArlb7gkoAeQomVSq4o+Um5WZqlADf/8YjBu3Gs+90AcuxVvAyak5SysWN9jsbihZqSOatZ+IDRtPISGZQBmAMvQvbUiWKXuTAzV2Z+5ZIHdKvoCSguXmjIMiQOk0gEuXY+DlOQ2FbC0JTGur2FvD5tweLk4dYDf73Fk64qGqvTBx8ibEEizBIZhUBJ2BRx2gAKfflD8EylhPHqDknNTvpdnLV2LRotWnBKEJQekMF1sPOLt4wcm1FWwubnC1uaMwQSps60bAevG89nj4kc6Yv2Qn0uUvWQkjG+uW6+OmQheXumeB3Cn5tyj+KezHkiiMHrsR9sKypJYoZO8KV7sPLckDzq7NWZoRNIJFyypi74LCzl0JZAeeWx8vv9wLu/dfskCR7xRdV4ziUsywAKhfS/5iFHt/RnYKSxZ27gtEtUd7GmtydqGbs7el5bihuFMjVHR6A1WcaqOKcwOU43ZJ7ne1tYMzLczVqQ2KF2mCrj7TEHojTbWTm6RyKVuVdRUA9VuST6Dk9DIRk5CGd4YuI0iN4GRrTetpArtLXVRwfhM17LXRtlgtdCvzJrpXaop6Rd7Ek7a3UMrWFHZ7BxRx9qSbbIVHqnrj27XHrPpJLMhODDExzLAAqF9J/oBiLMlmjz92KgJPPT+QQLWBi2tHuryGKOP0Gv7t/CxGV6yFnc81wPF/1cORGk2w4pE30Lv4K3jaqSaKOjenK+xAoNqhaNG26PfuIqTkZrzZpPwKW8YdFgD1K8kXUFJoRkYWFi/3hWuRTgTKE66uXVDauQmeJxCDiv0Le6u9gPinn0LigxUQW6USwqo/ji0VX0JXe01Udn4DTi5NYaNFORPkmrWG49TZcOsecnv6I0gFQP1a8gkUkJiagbEfbSBIbnBy9oaLiyeq2BqjLV3emkqvIPjhx5D8QEWklGOp+DBSqj6Faw+8hrll6+JZew3Y6AZliWKAj1TrhjXf/WzqVScoAOr3Jd9Ahd9KRoeOM3OB6gRnkohqTnUxvFBNnH7oRWQ/8RiyHn4UyQ/+C9n/aICcFxoi6ekm8H20BZoVehFFnWoxrskavVC+QidMnPqDqZcYCSuTnxUA9Wu5R6DExKhBSkBoHBo2/ZyK9qAb6wQbicRjTjUwsdi/Efn4v5Hz8ANIqvgQMp+pg5xX3ZD+aiPg5RYIer49+pSuSRb4Omyk605O3VC6TCeM+3SNqVdIZWuwt4BM/Kb8LlAOZd3tioLCE9C4+UQqmiDZPZhH1cET9mcwo/iLiK1eAxmVK9GaqgP/bozs2q2Q8NpbSH/pLYT8qxWGV34blZzqMNfqxjjVHRUrdMNnEzch0xirhngdccrcqkDyyB9a1N1AhUcmo3XbqcaiNPLg4lIb1Z0fw5dF/omgiv9EbKmKSKz+DPBqE2T9uz4yXq6F9Bq1cKlGY/SoUpuujzHKpvyrG4HqgimTN+fWTOJPq9VovHGDBXKH3DNQDrCiYtPg3W0hFd0WLjaVN/GQ0+MYUehZnHm4JuKrP4f0x18CXngT+OdryHnm30h4oRZ2PFcH9Yo/R7ZHoFx783ofVK7igYULdpl6VbtekzgoeoHcKfkGKjklAyM/XEdFt4ILcyK7czOUZ4xq6fI0lpHdhb1YH5n/qI2UB59EdvV/IL36izj/WG2Mq/ASHrc9A2fb23Cye/F6dzz+TB9s3e1n6s1i9ekm4eXG7yKl/XeXPyt56sqzasr/kOQLKI1yZ2RmYwUpdYmyJBO0KruzO0rY6uJp2z/Qo8QzWPdYLVyu9ioCyj+G0IeeROAjNbG6al00dHkepZ1ehrNzU5YOZIxuqNv8I1wMjjP3ySCrJJWwSPp/BEpIOsp/Q5t56tR9teko/0OSrxillxLpXD99ORI1a75HoFrD1bkLCtlboIzTS3jO9jg8Cz+GhRVexMbKz2JdlWcwt1wNdC72Cqo4vYLC9qZMkDUw64YSpdpg4AerEE/9mDdUOXqxqLG+3wJK2w5w7rX8kfxOnbq3Dt1P+QslX0Bl5GQiGRlITsvC1InbCRBzKVqVc+G2KGR7g9T7eTzl9CSaOT0DT7q5Nk7/h7cZvx51eg6FaXVOjGk2W2de0w5PPNsfa7ddNM+XmZ2B7Kxk6kljflLY3aKz7lLoH5bfE4dWf6dOA5SjcFd+yl8o+QJKM45SlfzyeS6diULtV4dR+Q1hK9Ka8aoRwapD91YXlUkYHnJ62yzLOL2KoraajE2NGJuU6HZBiZI+6DNkJSITZaXsAJnp1FEab6bXHXeOnlv311igI+m+rVQzPsiSd9/t8luiuqx6HHlh3nsZ0bbuk3svHc9m4HScl3ddou279/0Vkk+gcqAXEpqbkp6chdlz96DcQ4xVrs3gWrQTXAuJXLQnbW9P0DpwqW2SDrpGu3NrgtoOzi4dULPOeOw8GGLUmUGFZWVp5DyD99E7KSnR3O4XcbTBkXjfqWyr3N4nBf+e0rTfOtdSrlV3XrG2HXU67vtb5/x/K/kGKplFA97aFRWXjsEjV6NsBSa+xXzgWqwXnFy6wKZip4ujBelFop2JsbOtDXOuVqjx0jCsWnfWvH2iWlknlZar8Gy6VguI31eEDulViFVu92bH+n8S6zySFtMx7rzeHGN7HEXtyHvMURz1OMof3fO/JfdhUTnIYOOyyP7kdEKi0vHBxxvx9L+Gw6UYabetI8HyZtzqbsYCnWhdNsamYiXc8fobY7B85TGk6sJfQJLSaAVGKVq3wNLxvGK14e595l9zTMq3APhPitO5ucrPvU4JtupR/mY6Tm5R8i1Xb87NLXcDp23HPfMe+yskX0CZOXx8DL2Q11palhxhDmJiM7Ho66No6DYZVap2Q9myXVC8TFcUK+WBMuXd8eQLg+HTZxm27/FHUqrqYh05KXRzdHV8UI3v8YlNsVzfne7LoZRs+lzrxSL3EQ8LXwukjIx0FrZOfvk/iEO5WbxYlqzTucsCihUr6VaRSzYjJQ4Qcpd5i6Wbu/dZ+//bkm+gpEjLAjKQkRVPuDQpmQ/JJz19IQpLvz6I0R9tRM+BS9B10AK898ka/LD1Im5GmSkxVL8sknaZxesIiK7LEEC6h+o1D3o3UDqkK6192na0yypmt+W2HBu/I1KmsQLeR6LT/1vFErXnP3eW+5F8AWWW7II5dHs5XGZmpyAqIRaXAyMQEBCFsNBY3LyZDP8b2QiNy8S1qFScDUyCf/AtBAdG4ar/TQTfuIW0TIJGUFSfvGC6eqO5g/YJUKlcf7dFlpOQmIEbN+MRHBSNq1du4JJfGC5fDkVQ0E1ERSUgjWnDHQq7qw5tCHABlcllTFwKQq6zbawvOOQWgoKjERAUyfUY7o9lvdwOiESgjgfH8PgtBAbyeBCX2s91f/8IHruF6zz/ZngsYmNSTFi4rbPcG/9S9KQs1uF7lj8E6m6RRRk/QcnIzMSmHWfQptOXaN56Blq2nI32HeZi8tzd0LQV/7B49Bm8BHXrj0PTZpPQotUEjBr3NSJukZdT5PJkAXI5XOMeUYw0Exss+5M3zEFcbDKOnQjEjDm7MHDgYnh1moYWTcejYf2xaNZ4FDp1+gTvj1qGdWt/xpUrEUhMpMWaOq1aTQfXGBV7RVY69/K+qbzB6vUH0L3nVDMv0cd7Njp5TYObxyR4dp+Prj0XokPHqWjT5kt4eExFZ6/ZpnToMIX3m4b27SbBvf0ktG71BTp7TkevnvMwaMBcTPxsHXb9dAn+V24iKdFK4IWK5uWbaXEKG+yMxt3fE1jW9fkGSr3B0VvS0jIxbfZuEgZNGWvP0gl2Fze4dZ6ORCrH93gwHv4/H+5nsmsmYjbBq7WH4lpIlLleWlTcsWKGHoAKplu0AjmQmJSGw4f88Okn3+DNeu+hfKX2ZI9NTT1OTo1zl/VY3kLhwk1RvXoPtGr9KWbM2IgL50KMhZnbGC/ACgmOWVJS2CcGDJ0Pl0Jv8/qGLKpXSxVrlq91D23rPs1yl7pf/TxLPZuW9WG3MW8s2QzPPdMPbVt/jjkz9+Lc2VCkZ9DS+Wex2jQDFJ2HAct0qFx9/rboWPZ9WJRhZparSkvPwpzFB+BSgkyPiaxeXRQq0hFevReSxgNHTl3HY//ow/0CUslue9R6cwT8/G9YlbESY1Vkehmayy5yYmJIDt1OLGbO2Yaar/ZHUYJgZjwZZUphLWDTiIheXtrcWdqYfdbxuihTpjHauH2IH787jcR4fb6gkXkBxhX1AIosavDwVShSVIC0Yn1qI6+3sR6bOpW2dS/VqXkeAq0BiwBSsUC19lud5c5SF+XLtkGzZuOw7rtjiI0V8WIbHMxWIJlnv93xf1/ybVGqODfwU9IJ1JKVh1GygqzGh43ujkKFPeDuMwcMUTh2OhTVn9YrDSlS57jjtdpDcOFKqLneaJB1ZmXpi49krmmkIQdnz4ShX9+5qFC+Ha+RcpQsKy/ryLysFZydG7E0g7O9NZdtSP9zh7JsnixtuV6P572N12oMxsL5+xESnWpccaZRjm6ag3S2b+zYjShVUh1Mr2vcTN1Oqo9Juc3ZPbfuFqyzOdebcklQbE24T8CxcL8pZr2ZSept7DTOApr7nZxkrW/j0cc7Y878XYiOUXJj9RWjQ3qOPwbJkvuIUfrHWjdArTqMEuX12kJjeF3h4toOzdpPRnQyLepkGKo92Zf76Radu7PxHni97ghcDrJmHsn8qTu6PfUyub4cXLgQjm4+M1GsiECi0u1dmTx7UwHuKFrEHY8+1hO16r/Pe0xAq7aT0KTZ53jupXfYWQiaSwsq3J0uSNYr8BqhWvWemDBzH5NzxQcZrKJfpgFq9Ac/oGSJrqZ9AthmZvJ25pIdQvmgE7dtbIexMBVasjqFOgPvY2OO6GS2dS+118Oqw1kjMKzPrvN0XX08+XRfzFlwELeYyggo+STFLD3zvYCV/xilOh1A0fcu//YwSlVSr7TG8VwKuaMVg3As2ffRk+F49Kn+3K+PBHrQArxQv+lYXAuNtCoQUETK9DBuBgfHY+jgxSjqqt6o4Se6TXsPFCvZFS88MxjdvGZi8ZJD+PkiGVlkDq7fzEZAcAa27LqIER8tQ92mH+DBqrRqV72C0T1VmuGpZwdg5cqjSE2iejSeqByQi2Ej1qFoUavtdjO1wAvFy/bCQ9XfxcOP9EGlSt6o9FAPVKnWHWUrdUT5yp5c74bK1XqiyiN98UA1nvNgN5Sv0hWlynZCibI+sPPev4Cp93WF6Uls6sit8I9n3sU3a88iJYPuXVARKEf+dVt+G7Q/bVGLmDcVLa2e15mK9YFrYXd08JmNBCriyM/hqPqYLEqK606gPAnUOASE3zLXq4GaHq3qoklrP/98IypWlHI1748PSCssX+UdeHktwLaNfoi8mW6FGDUijc4slX6fSS67JNK4OOcXjakz99BqP0SR4urZnmyXLKMxar06BFt/PGvmJao/K0YNe28tihYTUF50X51QqKgPmrvPJ2vdh5nzdmDC5I2YMG0bJs3ZiTFfrMPH3J4yfycmz9mOCTO2Ycq8nfhy9lZ8NPkHvDfuGwwcsRZuHebh2RffQ+ny3eguCZA8iZ3u3ybLbYz6jT7C+Ssx5jn05L8GKo+CKeZxWe7PonLrFVCLCVQRAuVSqCsKF+rJGNUent3mIYlA+R4NwwMPK0YJKLow9rC6jceStlusLyMrnU6IOQ0j/cYfz+Cpp3rwPAV0b5ZOqFi1L4aP3oDAywmGsQmQ9MhbiPxpPyLmrkbUzGUIW/ot4o+fBBKSeE420mjJe/cGwqvLbJSt2I1KEliMQVRSe7fPcfGcFR9JWDF85JpcoOS226NkuR6YOPcYotkHHOrSbVXoyU3yIBHUpjlmy9qfwp232AQ//zR8t8UPH3y8BS++8glcCwmonnBy0bN1QJFirfH5pK30OHpy3udXrk93vg2W/lX5Bah79ZXmKgdQ7J0rvmGMKusBFxcfsrPebFh7dOo2B2k858ixcAIli5LFMc4wQL/eYCT8mKBKMvUVB+Va4C14MhcxH8CJNDh3RvkHe2HoB2vMZBoiicgzlxB87AwST12B/wfTcPKV1jjx/Ns42rI9bqz4FilnAhC25wwSrlmM0s/vFjp4zYFrMblkgsV4V7oklTR+DZLYi/QIw9/7lq5Px9WR3FC6og++XOiLqLQcJPIBwm8kMPmNRWhYLMIiYhERHYfo6ERERSchIoKJd0gkl3FIoPtQAp1XUojktxuvofbbE+BShM8kj+PKjkM2+WyNgThw4rplVdK7AjXFGn4SWbOs3uzLLU73BE4eyev65EZWrjnCnmg9rLOTN4Fqh3aeM41FHTkeTn/fj8eUY9G90KJq1x+Jc/4WUFkESgO0K9ccR5UH5Md1XmeUKOOBXkOXIihCw0w5iA8IxtGly3Hqm3VIP30ZSd/uxrXeH+Fc+z4I/WQi0nYdRuIBP5yc8g3OrdyKjBgroT5wIBh1641nzJDFyHIaoG6dwThz1h8ZfIahw2VRco1iii1QtnJXTFt+FLG8dvf+axg6aCl6dp2F/v1mYcDA6Rg6dAbLXAwbNh8DB8xGz15fYOCgqfh8wjps/P48rlyNQWKyRYqocmhYc90mPzNPXx/2ObvIu9Bb2Fti3MQfkEyzNurM1aeFhfY4iqVqlV+A+rWv/B1xXEkxrO/rQ1aMyiUThQp1hAczeOaq8D1yPdf1iTnJUtxRq977OB8YYa7XwwSExsK7x2yeo3yFYJI11W0wBqfO00VlpiPmlB/Ctx9E6M79CP5+G84vXIObO39GGhPh6E37kH70NMI27MKlWRsQtnIvQr47jLCtR5F40Z8xDFjx9QnS48GMF+6oTHLQu/c0XLkWBuXCwxhTihWzYqLiR1la1LSlx6Avk6fP2I4KzIOcydgK2evB1aU2XO21yChfZyx+iyzxDZZXTSlTugleeG4gPNy/wldTN+DMhWAkZlggJPM+H3z6PcpVoDU50/3Z5AJboA5jlV9QvHF/DjJlyZ1AOcQApZJJ95LlGBz9TyKTyj3HAVShkgKKtFYJb6FOcO88C4lifYxRVarqS0MxIMWKdrSo0bhElyFRnFjzwwk88ih7mfnutyOqPzkAS5YcoZKzEbXvAH4e+iGuz18L3ExF8HcHsWfULARt2I/Ek9cQffw8Ig8ew+XF67BvzHREHLyC7PPhuPD+RPi9/xlyLl/DjVvpGMxAX6fpGHz25Wb4XY4yKkgkiIOHyvXJmgRUExQv0xFfLjhggJoxbQcqlheIzJtMLlebpSbLmyzKjzQi8UbuthJca3SifLnWaO02Ft9tOoEE630O/AKT8QYt2+4q9y+wOqBURW98s/GcSe4ZWvP0f8v93Q3WL0DJmhzr/0lMJQ6gRM9X+dKiFAO82PuU8HaCp89cJNP1HTsaTrosoJjwin3R/F+vP4Y9yQIqitF34Ah9Z2Ulta5F3eHZayGiYmhMYTdx4sPPsKeVF2JnrUXWyeuI2nwK8dsvIHrPeQRsPoCg7YcQsGkP4o9cQtSOE4g/cBaZB8/h2sBxOFCvHUJXrEZWRjrOhERh/8kARCdYowOSOKIxcMg3BEr5jzWqUaKsFyaT/sfz+NSvtqFiOQGlWVMN2fbX+Qy1uHybNF6JbwMqnYm1nQAxCVYe5qxYbECvw8R+APYcuoJUAiF1D3lvNQoXkZ7EZkWW2mDcZxuZJohUWOeoWBjkBUrlPmKULrSqzbWoFQSqpAWUnblSocKe8Ogyx1jUkcPXCZRMXUmf8gu6vrqjcfaa5fou+N1AvUYf8piGh9oyN/HGrGW7eSQHKZdDcHridJwd+TlSlm5G4MdzEDTza+BSGFneNcT8fBWp568jZtc5JJ8MRNahswj9Yg5uTF2G2Gmrcab7SAQv/BpZkTFm+EhixQ1r4nQ8OcogA5Rj+Kk5ylTpg5mrToIcE1O+2k6gZG31qNg6sLm8xuWrfIY3DUCyKmd7XbLd+lw2IZlqZ+Y5utDFWt7hdXTtNQnBkaoNWLjsIEqVVqxU0ShNC3h1n4Jb7DxqntxfLqfgtlbyApVzG6h7sSYjfFCrIguoBSsOklkpIHdmj+pJMtGFMWoOktl5jzJGVXlQ+QN7mTJ2ZvKv1RmF01ctoDbROqo9JovTkAuP1R2F42fJ2m5GIorxKHbrXqQeOI3IRd9hV4suOPfRF4j+aS9JwwqEbDzAY1dwefxKnPtiEWKWrcfpnkNx6J0xiN9yDKk/Hkbs8o1I2HYIWTfj1Wx6gAwClcZHz0YS2zd0OF1fMQElK2iB0hV6YebyE8b1TZu+FxUriA3KYhiT7K/Rel6hdckFvkV3SJBc65Eg1DUW5+rSirGrFYFsBhczO+stxsYO2HfsmnnWrTsvozLJihiozVlLxqkGI3AlOMZoUy8rtbwNwW8Albf8oShGWdcyyczCfOZR9qKOGNUDhQt7ozvdl07xPRyKSpUd8Udxyg01632AC4HRVFoOpszZhSIlraEi16Id4dNvIRJJuZI27sLpzj0RtnwNEBqPmK2HcWYCY9CP2xCx8ifs9x4Lv8nfIG6tL874jMfPPT5EwrdbELpkDfzmr0GaOsLFYISM/BJ+fcYg4fA502a9akjPkfvLRgrJzuAR3zKvEdOUxTdHiXLemLnksBkXnDr9ACpUEFNUXkc3Z6frMxZVi4VAye250LJsdQgircpZ7rAhlw3gQlcoclKkeEssWrXP5Eq+R4JRvZpSFQElnbTGS68MxYnzEQYcvTfXyi9ez/wj29dfnhh178Jzc0/X6Pn8FQdgL+YASjHKC12Y8GoA4DCBqlhZZq6BS/Yy55Z4vdFYXGVekpCYhuEfrOY+C8Qy5b3xycSfmDVmI2HyIhx7pQEujp7A7PUiUn48gpSDp5B9MQhZ288icd4eJG9RPGIMWLgdqYu2IOfIeaSfuopbJBwJO08iZctuXOrUB0frtEPEN5uY2AigjNwhpFyghq1BEXYQKy1ogeKMUbOX+Bom9tW0vShfXkBpNF0gKEa9wu3XGI9kYbI0ASWLqkvw5CK1FCNUzG0O18JtMGHaj+yUmThx6iaef3YYj5MdG6Da4fkaQ3H09A3j8uSQrd5kLfSPBqn/HFC5IqDmCqjichGKU4pR3vDuNteM7Pj6hqFSFSV5GiylRdlaoObbo3ExKAYxMUno0WcOj1nx6cGHezLenQAC4hA5aAIuvdkeEZ/OQ+LszQgaPBVRy35Azr4ziFr8E0JnbEb8notIPeWP6JVbcH3qCtxatxOp244jcPQC+A+bjuRF6xDWeziO126FEAKPCBIYuT3zBjnHuOZBQ9cRKMUMpRZuKFrKE1Pn7TcqmzJ9N4FSbqfRc5EF0XGBVJPA0KIIkE2fEMm6WOwCzE4GSIsz1kWLKVq0PT6Z8B3jdQZOno1BjRdH8np9/CfX54F/Pj/IDFwLKL0qNa/wBZJR8Z8EKu/kDQE1j67PpaQeVPSbrq9IF3TrveguoFryQejiaFG1G3xg5pvfvBmLth0m8Jgeyh1P/HMwtm6nxbDhZzq8hytNeyN55nrETliDU+3fQ8D4+UhetgknvMZgR5O+8Ju0FJHf78TPfUdiT+OuuPrhXCSu34+AYTNx3udTxBLQmLFzcOyNjrg2ciqyA2/wgTVXwqLMSSQ7FlACQ+1viyIlSM9n7DFDQhozLF9Bna8llduM8VeWUptx6A0SBgJk6HkdPjOLOWYBZXMR2dC7rNYoU6oD5i7cw1QgC4dPReDxJ9/lfgJlxv088HLtUTh7KZL6tIAyCMmijHpvA6X/fiET9yx58ijj+phHubInGjLh3JNAedFSlppB0sNH6PoMUG58MA37t0LdFh8jOCoJQdej0LCJGJ+GjTzx8lsf4tjxSKT9HIrT3T9FyDtfIH3DAcTP34Krg7/CzQUbkLZ6F4L7fI7z7sMRMmkJYlZtgn+/jxHkOQYxkzcgfcdZRE1dD//hcxD37TEkztnCc99HyLhlyLkWaTqrRq0lSYb1afTcYVHtULi4J76YugdpfLwZs/YxRumY3jG1NomvM0Gxs7gwPtltcn0sDgbIdblAZ1fGKRexxWZ4/vn+8D1+3dzxx92XUOnB7txvhQgNqzVsMQH+oQkGFwOKdCugjNwFVO7efIgFksS4vuUEqqQeiEGSDShCi+rZZ7FlUYdDUKGSek8bUvf27G1tUK+lBdRl/5t4/Y2RPMZAbvdGrbfH4RR7HQLjCADjzpZDwJWbyDgegiQmj+nHLgEnriJn3X6kE7CMPYxRR68ifeNRZs3H6BYDke3H8w+cR/KPJ5BJxpm5/xJiV+5EynaSichEPrpCtgVUIoEaMIRkwsQolXYoXtqbBOegcm1MnyHWJ2trS1Das/1kcyQLLiQLdlsjAid3qJeJXDo3gitzKxfFWxImvauS+3t3wDJExIiaALOX7kXJsop5XQi8UpZ26N6fnS1Bv6qmhIcKE5OwUKP8SaBEbVWF6jKub7kvCpXWA8mqRCa6oLP3TKTStRw2QClw6rUFgbK3xVtNx+DS9ThcDYjAW3VG85josTdeqvk+jh8PR05gBPwXLkXQqrVIPXMNUTuZ3C7dhUTfC0g+fIa50Rpcm/0tIknBE4/6I2zVbgRM2YDI9UeQdeE6EpkEh3+9BcmH/JC69xiuzVmO4DXbkB4WwaReL+2sLqvB9neHribrU96jGEtCU6k3042TplNPm76HFqXnktI7EhB2NltzgkE3aN746k2z6HgLPldzusRm7Kii+W7c3xq13hhFSh6MNCZxGlfsO2gxChvSpVnEPuzcnhg/ebtJcYRENh2uNZhgmkf5k0BZ6Fv1GdfHhLdwGfUUi0wULtyZZGKOeV10mJS0QiU9rFhfGzawtQHqalgcwsNj4dZmsnkwJcvPvDAEB/aFkLkF4VC3d3DMpzfiVpFyf7YBh9zGIWTaOuZKP8DXazB2ufXBxclLEfH9Xpzq+xF83/BB4OApSN9EkD6ZhbP9xuLWhp2ImbUIh1t0xMVRXyL9aigB0EtKCygl5AOHCSiBpNIepSr0xPxlR8yzTZqyGeXKqROpyOLUTsUeJcfWvA0nm/JDgdWShSyvSFtUftAHrdtOxKYdVxCpb4oox85EocarwwmgXCJ1RYt77Jl3sWW3vxl1FySi4gLHrKqYvbdz1vuyKGt6F4FKy8TMxftRtJwoOAGxdWeM6owe/UgmqI/DR4MZo+QW1dva0He3pOv7CMHR8bgVnYyevZfwmHKYTqj2aB+sX3sG8KNF9X4Pp+q2RsyEJUgcvxGnGo5CwLgVSFuzDwEjp8Gv76e4ufxHpOw5jpvjZiOkw/uIHbcIyau3wq/naPzsNYzuczNiRn+Ok681YoyaznwsxqgiM5f1Jcj1DVMelUuEGDOKl/ah69tjLGrWvE14pJoHipXuhOJ8vhJlOqF8FR+Uf6ALylbxRKmKHVHh4W6o8mhvVH2iD55/7T10fWcZ5i49RoIQYYaOJLH0o0NGfYOSJelRnKkLxmM72aCbx1cIuZlqwWM6z28B5fBd92VRYk7WxamaLrZwP12fLEqWwxhV1BO93iFQvKfv4UACJSWQ4hqLIlAtBFSCeYczcpQ+MVVP7YhypMITJjDfCU5EzCfTcLJmY4SMmICM5fsQRuYXv+kYcCkaKTsvInHNYaQfuYRMv0Akbj6EhNW7GY/OIfvIRQRPXQa/CYuQwMQ4rOswnHmrJSIXrTaDe1nZmjRq5VGyqEHDSSbMi0N1tI4oW7EXZi8+bF5PHDvpj6mztmL81O34cOImfD5lG2bM34eps7djytwdmDDzJ0xZsI+xxxervjuDXYev4VpYIpIsIzKSmpmN+SuPotoTvWhx7ZhX9WQM64TSVTqxrl1IYW/W7x+aOe7qHtKrrjfqtXzXnwDKuliXGzKx4hDsJQWSSjcDVL/BS8zx/b7XUKGyemxL8/tH+lm4Bq3HIyQq0cy5mz5rO7N3uR13xrYO8OkxA3HB8Yhf+T2ONPKgFc0AzocjxdcPKTuOIe1kIEK/O4IT45YgYMVPiNh1FHs+m4O9X8xCgu9ZZB2/glgCl0z3mb7nDC53GUJq34M512E2lh0s05pzLhE9HzJiPYoWVwwVM/Vkp3oHi1edMO/IqGMzuq/1JNJrsVjt04iKJsZoW8fVIfOKpmgnp2QjJCQei5cfxtPP9acl0X0yd7IXJmB8zjpNP8SFK2ShBMZ8duRg0lKao5iFQ9P3A5Qq1ZJFI78zFu+Drbh8uFycD4HqhP6DF5tz9vv6o3wlWZSbYX3Orm3RqM0EBEdqNA3YsvMcqj+peX9yf254udYAnD4ZgrTT13Dlk3mI37AfOVciEP3tTzjVZzTCpn2N63PWY18XEpLxKxC9dj929xuHbQNHI3bNFgR/Pg/nPpqBlFMByD4fjNApSxD01SKkXrlODbPN6exmuYrVoOyAoXJ9aresqiPb2hcLv2aHIJZKyK+QmV71j8DlK+FmynZwUCyua7qzpmizBJlpztE8HoZzZ4Nx8nQwtu+5ZgZ0PTtOw6N0586GBXrBuUhv80nSA4/2wsoNpwg0qUJOOoHKjUMOgCxcjOTdzDdQlh+1Ljeub/4eOBcVc6LlMJErUsQDPd+Zb/z8Ad9AkgkpgjkUA7Zm6DRpOwnBEdYb2MvXItCw2XgeV5BuhYce8sCSJXtIydiLD10kKGsQMouAzF2Jo16DcOmLecjwvYi4tQeQuvUccsgS45jk3vpxLxI278Px/qNx6oNJSCLJCJ2+AlFff4+sy8HITrXeuioUmA8UKfHsK/2HLCcTy207rbp0uZ6Ys/i4YWnrN/iiQ8eP4dbuEzRr8SHc20+Ad+ep6OI1GV26TISX15fozO2OHSehVatxaNRwKBo2GIlXXxqCByp3JDsU6VBh3S7Mm/StM+n/OyNWIjJOk0L1U8cpBEv5Uy4ceZGh5N28L4tyvOOX65uz7CBcSshq2CDnriQTHZkfzDOh8aABSq6F1kTX4mzvjPrNmeSFW1/Cx8SlYdRH39N/y6JaolChVvDsNA03wulqAq7jSJ/h2N3WG9Gk5DFrdiBy22HkhMUg5UIgog4zRzoSgHgCmk1Kn3YuAP7L1uPG+u2ImLwExxt64caspciJS8aVazdw+nQg46KmE5tbG6DeGbqYFiVKrYHhdihTvjcWLjulroiJEzegXFlNtqzH0gx2UvBCripN2M6GLM3g6toCri6Mv856O82k17xk1NhlAy4boxATX1cX6caD57ijkfsMnLoslydSozfA1i9VOz4l+gWZ3EY6NiX3aVFWFm2AYsLrwp5iJbyKUR3Re9ACcwPfo9dR6QH9Sos7jxEoZw+83ehTXL2uWQn0Rjxp409+eKiqkmJLYQ9XJUUm88phgnpp9gL80MIDQTNXAWFpiNpxGoErNiNs2wH4M1+6snU/Ajfvxq0dRxH8zS7EHruKuFNXcWTAGBx364n0naTrwXEYOmQ+3m7wHr6augmXLkeYt6rJTB8GDKNFFVUnUWmFkmW6Y9rsI2Yq2ZeTN5HgiOg0sJJYxRkzx16gCJCWBEYjLqLvyqm01MtDJscuHnAppC8tO5BAdWAHbY23m0/CloOBYPhiTBJISoQtazIWleuSf0/uDyhzkwy6vix8tfAgnEvIx3uzkaTnBKrnEOs1x+HD4ajyoIb2Nc7XgQ13R5PmXyCIeZRDrgXdQrsOk02vtWJFe9R7831cPh2GtPBwgrUCN9fuRQ6tLGTFPuzuNR7h3+1DWnAkEgJDEXfmEq7M/BbHR81B3CF/JJ4OwLkZC3Fj9Q/IjkzD6mW+eKyayEJzVHqwM7p0+wznLgQYMAZp9Ny4PgHSHGWYR81acNzMoJo87SeUr6BR9UZ0XdaPGdtdmfS6sDAfctFoBYsLn8nZTuqtiZeujNXsjOajcme9znAnrfdCW49p2H042PyIpDyNJvWYDyL0VYcDqD+Q/Ls+86dcJNPEqInz9sHJTLmSVXRHIQLlPXieGdg8JKAeEFBM9Pgw6mFNm05EIBmRREP7yTSrpauOElCLIouQlCnlifeHLcGtKFKz2BTEHw1A8JoDCF26G2HL9iBpy0mkbzmGpPW7kLnDFzGb9uPmhkMIWL4N/mt3IPVSAF1eOg7uvor6b37ADiRmKVbaFI2bjMTZM4EGqIFkfUXMaIEsqgnKV+6D5d9cMMr87MutKFtOnkC/2qkfPuE5dNE2OzudC8HV2wADMC3JmYAKLFJwTXO229uiRNlOeLXOGLxP1378XKTxHop9YniZ+hUAM2SUx6L+QPIFlKqTpSgQaiuVrG/Swj1wMhRbiu5hgOo8aJ75DvHAkRuoUkWzkPQw7nyAzmjaZAqBsshEhr6C5zKQ7smr61yLxtJ92ghY1Qc8MXbsaoRFMCmMSUbIxmMI+Z5u6UQQguZ9h5Ne7+NcG7LEfqNx44dtSD7hR8q+FdHKp+jafiYLa9XuY8aJ1mScaltnVKrSFTNmbkcqk9Bk6mnAe+uYHsiiFPQbolyVXlj0zTnT9jEfb0LJ0h5wJYhFbO4mvShUyB1FSniYCafFynqg7AM+zIl8UJL1lq/eCw8/PhDPvvA+3D3nY8KU7dh56ApuxKSaTivw0xiLRN/N/BRNJMqdp3Ivcp9AWUVATV64G07mLWk39tzeZFGe6P7eYvM6e5/vTVQk5bWCNf223Qctm89CaLhUIaDSTFDVd7Tb91zCS68MZ091o1uRG22LShU90bfffBKBUGTH0/4iEpBxPRrhG3bgyrjZCBg1jUxwDqIPHUXOjWhkh8Yh7UY6flx3FA2aDCcIetOqT3T0A8XN4dVtDvwDrPgoev7usFW0KHUOud36KFXRC9OY8CbyQcd/uQNlyvmwHczxjKW74ZXaYzFkzPeYwiR/5rIDmLfyGOaRzs9nWbj6JFauP49tOy/j4tU4xCSad7aiCkjjM6aTcjrmRZi0SQal5V8BlMTciEsV5VHTF++Bzczk0Wc3vVC0RGcM/GiV6UV7DxGoirkTMG2krHZvtGo5EzejrBFlWZT5Eo9/mrg4Y+4ulH9QLqotirA+VyqoZKkOaNh6DBat2YuQG/HISmaPvJGMHCo85+ot5NAas+nm0uKycNY3COPHrECN57sxlpB5meCvcbg6eOWNgdix18+0WyLWN3D410x4RWLE1BqidCUvzGJMU+smz9qL8poSTTYrIqRzBoxcD7/QJMTTPJKoaM2GVTGJMR84nesCQ/dQRxZQAiiDqGSZoatsWjstyULQAHWvcl8xyvG0AmrOsv1wKSag1Ou6olgJLwz79BvT0P1HwlGxslifWBPJhEsntHSbgghN7qYY9iNXYFoOBN1IxIDR36JoWX32ov8Lgb4A6QznYq1R9dGOaNPhM0ybthMHdofjyoVUXL6QggunE7Hx27MY2GMWatXoTwvWmGJDuiq9VdZvrTfGs//qj9W0sjQlvKZl7Bg06sHDNLlFMUrtb40KD/TG8vVnzON9NXsPgbJcpvkaw9YKH07cgejETBOhlQlpgNfow4g6XAYys2U5GhayhpA0cpGh/49JNlMDOlX9EkB2FkmETsiH5A8o1c1uYH0MJqCyMG+FXnMIJLk/bxQv4Y1BY1cYn3zgSCgqm5dlDMQkEi6krS3dJiHiluX69FGc+ewmSyxI/zsV4GRgDHqNWE3LYqwiWHol4OSqpLmNmS5dsbI3nntuIF6rPQyvvD4Er9UcgWef6I9ShRXcaUGaAUSGZlHmlnjt5ffx9ZpTBMZSjH56QUrV+6hBQzagqHnDq/o9UOmhAQTqvLGEL8j6yppX8bImFlrnyI82I4LJqiBJ16iC2k2/LSvR0Ed2LpNTjNRIlRkZ5231Bb75VRrzqYHO4TpPcOSj9yL5B0ot4FKrKbT5T2fuIplgj7TT17PnFSvRDYPHrDIPe5AWVelBkQmC6OptZoq2aDsN4frKTWI5af6ns5X6sU4Wv/BEfDpjD5541vFqwDHyoQ6h3u/IZ/QaXyPzbiaW2EmJ9e5IczOK0MpbtJiEbduuMGeyFGI6Q7bunW69jxqylucJDOWBXVCarG/2iqOmDV/N3m6Nqphpbrp/I3wwfhNuJciWCIIsQx2WyjafeJq91vM4Vo2Schc6wyLneco9xifJfVqUGes1P6394fTtcCrNnl+SyV9xL/Ppyrgvvzen7z0UhgoPOmbKkkEV7oo2nWYjVF9oGGGF1lPkrsp5WKngDUb0ld9dwNtNv0DpCt1JBvSFnz7VZAJJCmwlyNbQk1W/jpFGF2qPB6r3RP+hq3FKtJi92nQDdgbNQNInqFISiSTe0fdRekVTtIfpSBUf64fFG0j9ecbsBXtQ5VHu13dWZWhRxZth3OTNJAnW8E+2XJlYkLDRQs8gMUvHQ1ni2LL2ONasznmvku8YpcrNqC/XEmhRXy7ei6LVPFG8ensUqeKBUpU8MepzK0bt872Oqo/1YWyiAsm6ipboAHevqbieO9ZnRG3Wyaaod1IRil3cTKaDP+0XjRnzjqCV+1xU/+d7KFO1L4pV8IG9GBPQws3N/8TFtURHlGGHePbV0ejadyHWfn8aYSQsVrbiGKGmq+HS8SGExoX7jFqJYlU7wblyFziXccfD/+qHNbsumv4+ZfomVPo/7q/MjvGwzmmC9yetwY2EVNapulKpayo7t+2WcegfXa2upqK76886borWTflLgbLMVw+tJiRlZmETc4VuIxag6/uz0WP4QvQbsQyrfrAmMZ6/fBPvDFuOHgMWoO+w+eg7eD5mLtyC8NzPYoyo1bkPa7ql/kdivFo/wWO+6+XupJRsXLyShHVbgvH53H0kK2vQf+QS9B66AP2GLsLwsWswed4BbD5wHSE3UxgbFOSlJv0QJBVrpokplvAWmZbqYtKyMW/9AXQZMR9t+89F465T0O2DRTjkd92o+ofNP6NT32lo2HMqGveeiha9P8OSHw/hZlIa61WiyifUuy2ZExEwccgoX1eri0gDikvab07JA5T+/mKg1AANJmbwL42u5BatKjw2CWFxiWYZEZeM2GR9hc6kknw1MjYZ0dx/i4lLFJexpFspZENqsBGtqNrchzCMiX/ZGmZhsDaKyBVyFzP1Ki4hBTGsL0b3YolnLzfvjHiqdbapiXUQ7Bx1CrItgUc3YII4259Cq41KTkNQXBIuRyXiYkQ8gmITEZcpVidWmAb/m/E4HxmP00wLrkbFITolHYlsuzX9WIBYRf5F/2ctK8rq3o6H0vHchzNiQaQntK6//Wx/JPdBJtSbNPgjGmotdTtHEyXak8GebE121H6FWut/kqfz1Ez9/fIQWlWv5IpRgjnEM8WgDFuyHsrxZ12rcqdYI9FUM61SPwIi64SYGLuNGQXgLrUpi4QiPSfZegZep9otLsjOoOO6b+5dzL7c445zTDwyHYjFLPXEfCo1/I5maducbG2apYqlhdv7/1jyD5T4v/6z2sel+p/sRzkRdxggmcgaVkTzN/FGvc2i38orRMmtyrRHlXDBMwSI4p+h/6xHSlf/VjGdgscyeK1Gv/ULLLodF0ZxIjimG+i+5lsvUwXPU11UJBts5TeqN5nLJJ5NEGVhoth042JyWYZic2naomutG2Sxwky2y4Q4tVcl77qj3CHc8at9Eu10XHxvkn8y4ajbca/cns+nZeEOowiCl7tt/ZaCjmudyuR1jjkXVq9SJRIttU3hYWMBVI4GMa3ebSnaKEudRdWrLp1uzs8FSveVcrVfzVGV1qY5V3VZ93HYCPcKeN5L/zdTk5ASYf3kj+l4OsYbmJ/p4fKO3EcV3rfkqeceJP9A/YZYADiAuHv9t8sfyW+d/1v7/pzkqVcdg6hazFCgcd3su/OeKv9/yH8FqL9Cfk85v7Xvr5C89/mr73Uv8j8LlOR/RUn/C/I/DVSB3JYCoP4mUgDU30QKgPqbSAFQfxMpAOpvIgVA/U2kAKi/iRQA9TeRAqD+JlIA1N9ECoD6m0gBUH8TKQDqbyIFQP1NRL+FFFtQ/tdLTuz/A49ixDFH9QxIAAAAAElFTkSuQmCC';

const createWorksheet = (workbook, data, sheetIndex, totalSheets, nameCompany) => {
    const worksheet = workbook.addWorksheet(`Report ${sheetIndex + 1}`);

    // เพิ่มโลโก้
    const imageId = workbook.addImage({
        base64: logoBase64,
        extension: 'png',
    });

    worksheet.addImage(imageId, {
        tl: { col: 1, row: 0 },
        ext: { width: 50, height: 48 },
        editAs: 'oneCell'
    });
    worksheet.getCell('A1').border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
    };
    worksheet.getCell('B1').border = {
        top: { style: 'thin' },
    };
    worksheet.getCell('C1').border = {
        top: { style: 'thin' },
    };
    // ตั้งค่าความสูงของแถว
    worksheet.getRow(1).height = 28;
    worksheet.getRow(2).height = 51;


    // เพิ่มข้อความใน A2 และ A3
    worksheet.getCell('A2').value = 'บริษัท ไอ ซี พี เฟอทิไลเซอร์ จำกัด\nICP FERTILIZER CO., LTD.';
    worksheet.getCell('A2').alignment = { vertical: 'bottom', horizontal: 'center', wrapText: true };
    worksheet.getCell('A2').font = { size: 6, name: 'Times New Roman' };
    worksheet.mergeCells('A2:C2');
    worksheet.getCell('C1').border = {
        top: { style: 'thin' },
        right: { style: 'thin' }
    };
    worksheet.getCell('A1').border = {
        left: { style: 'thin' },
    };
    worksheet.getCell('A2').border = {
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
    };
    worksheet.getCell('A1').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFFFF' }
    };
    worksheet.getCell('B1').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFFFF' }
    };
    worksheet.getCell('C1').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFFFF' }
    };
    worksheet.getCell('A3').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFFFF' }
    };
    worksheet.getCell('D3').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFFFF' }
    };
    worksheet.getCell('H3').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFFFF' }
    };

    // เพิ่มข้อความในแถวที่ 3
    worksheet.getCell('A3').value = `วันที่ ${moment(new Date()).format('…DD…/…MM…/…YYYY…')}`;
    worksheet.getCell('A3').alignment = { horizontal: 'left' }; // เพิ่มการจัดชิดขวา
    worksheet.getCell('A3').font = { size: 12, bold: true, name: 'Browallia New' };
    worksheet.mergeCells('A3:C3');
    worksheet.mergeCells('H3:K3');
    worksheet.getCell('H3').value = `แผ่นที่ ..${sheetIndex + 1}../..${totalSheets}..`;
    worksheet.getCell('H3').alignment = { horizontal: 'right' }; // เพิ่มการจัดชิดขวา
    worksheet.getCell('H3').font = { size: 12, bold: true, name: 'Browallia New' };
    worksheet.getCell('H3').border = {
        right: { style: 'thin' }
    };

    // เพิ่มข้อความในแถวที่ 4
    worksheet.mergeCells('A4:K4');
    worksheet.getCell('A4').value = nameCompany ? 'บริษัท' + nameCompany + '.' : '';
    worksheet.getCell('A4').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('A4').font = { size: 14, bold: true, name: 'Calibri' };
    worksheet.getCell('A4').border = {
        left: { style: 'thin' },
    };
    worksheet.getCell('A3').border = {
        left: { style: 'thin' },
    };

    // เพิ่มหัวตาราง
    worksheet.getRow(5).values = ["ลำดับ", "หมาย", "คิวเดิม", "เวลา", "", "ชื่อร้าน", "ทะเบียนรถ", "เบอร์โทร", "ชื่อผู้ขับ", "คลุมผ้าใบ", ""];
    worksheet.getRow(6).values = ["", "เลขคิว", "", "เข้า", "ออก", "", "", "", "", "ตัวแม่", "ตัวลูก"];

    // กำหนดการรวมเซลล์สำหรับหัวตาราง
    worksheet.mergeCells('A5:A6');
    // worksheet.mergeCells('B5:B6');
    worksheet.mergeCells('C5:C6');
    worksheet.mergeCells('D5:E5');
    worksheet.mergeCells('D3:G3');
    worksheet.mergeCells('F5:F6');
    worksheet.mergeCells('G5:G6');
    worksheet.mergeCells('H5:H6');
    worksheet.mergeCells('I5:I6');
    worksheet.mergeCells('J5:K5');

    // จัดรูปแบบหัวตาราง
    ['A5', 'B5', 'C5', 'D5', 'E5', 'F5', 'G5', 'H5', 'I5', 'J5', 'K5',
        'A6', 'B6', 'C6', 'D6', 'E6', 'F6', 'G6', 'H6', 'I6', 'J6', 'K6'].forEach(cell => {
            worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
            worksheet.getCell(cell).font = { size: 14, bold: true, name: 'Browallia New' };
            worksheet.getCell(cell).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            worksheet.getCell(cell).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFFFFF' }
            };
        });

    // เพิ่มข้อมูล
    const maxRowsPerSheet = 40;
    data.forEach((item, index) => {
        // const row = worksheet.addRow(Object.values(item));

        worksheet.columns = [
            { header: '', key: 'index' },
            { header: '', key: 'token' },
            { header: '', key: 'product_register' },
            { header: '', key: 'start_time' },
            { header: '', key: 'end_time' },
            { header: '', key: 'company_name' },
            { header: '', key: 'registration_no' },
            { header: '', key: 'driver_mobile' },
            { header: '', key: 'driver_name' },
            { header: '', key: 'parent_has_cover' },
            { header: '', key: 'trailer_has_cover' },
        ];
        const row = worksheet.addRow({
            index: index + 1,
            token: item.token,
            product_register: item.reserve_description ? item.reserve_description : '-',
            start_time: item.start_time ? moment(item.start_time.slice(0, 10)).format('DD/MM/YYYY') + ' ' + item.start_time.slice(11, 19) : '-',
            end_time: item.end_time ? moment(item.end_time.slice(0, 10)).format('DD/MM/YYYY') + ' ' + item.end_time.slice(11, 19) : '-',
            company_name: item.company_name,
            registration_no: item.registration_no,
            driver_mobile: item.driver_mobile,
            driver_name: item.driver_name,
            parent_has_cover: item.parent_has_cover ? item.parent_has_cover : '-',
            trailer_has_cover: item.trailer_has_cover ? item.trailer_has_cover : '-',
        });

        row.height = 26;
        row.font = { name: 'Browallia New' };

        row.eachCell((cell, colNumber) => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            // cell.font = { size: 14, name: 'Browallia New' };
            row.font = { size: 10, name: 'Arial Unicode MS' };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFFFFF' }
            };
            cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };

            if ((colNumber === 1 || colNumber === 2 || colNumber === 3) && cell.value) {
                cell.font = { size: 14, bold: true, name: 'Browallia New' };
                cell.alignment = { horizontal: 'center' };
            }
            // ตั้งค่าสีตามค่า 'Y' หรือ 'N'
            if ((colNumber === 10 || colNumber === 11) && cell.value) {
                if (cell.value === 'Y') {
                    cell.font = { size: 11, color: { argb: 'FF00FF00' }, name: 'Arial Unicode MS' };
                    // cell.fill = {
                    //     type: 'pattern',
                    //     pattern: 'solid',
                    //     fgColor: { argb: 'FF00FF00' }  // สีเขียว
                    // };
                } else if (cell.value === 'N') {
                    cell.font = { size: 11, color: { argb: 'FFFF0000' }, name: 'Arial Unicode MS' };
                }
            }
        });

        row.height = 26;

        // เพิ่มการแบ่งหน้า
        if (index === maxRowsPerSheet) {
            worksheet.getRow(worksheet.lastRow.number).addPageBreak();
        }
    });

    // เพิ่มหัวกระดาษ
    worksheet.mergeCells('D1:K2');
    worksheet.getCell('D1').value = 'รายงานรถเข้า-ออกจากโรงงาน';
    worksheet.getCell('D1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('D1').font = { size: 28, bold: true, name: 'Browallia New' };
    worksheet.getCell('H3').border = {
        top: { style: 'thin' },
        right: { style: 'thin' }
    };
    worksheet.getCell('D1').border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
    };

    // เพิ่มแถวว่างเพื่อให้ครบ 40 แถวต่อแผ่น
    const totalRows = worksheet.lastRow.number;
    const remainingRows = maxRowsPerSheet - (totalRows % maxRowsPerSheet);
    if (totalRows % maxRowsPerSheet !== 0) {
        for (let i = 0; i < remainingRows; i++) {
            const row = worksheet.addRow([]);
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFFFFFF' }
                };
            });
        }
    }

    // เพิ่มข้อความในแถวที่ H47
    worksheet.getCell('H47').value = 'CHECK BY………………………..…………….';
    worksheet.getCell('H47').font = { size: 12, bold: true, name: 'Browallia New' };

    // เพิ่มข้อความในแถวที่ H48-K48
    worksheet.mergeCells('H48:K48');
    worksheet.getCell('H48').value = 'FM-WH-05 Rev.02 : ' + moment(new Date()).format('DD/MM/YY');
    worksheet.getCell('H48').font = { size: 12, bold: true, name: 'Browallia New' };
    worksheet.getCell('H48').alignment = { horizontal: 'right' };


    // ตั้งค่าความกว้างของคอลัมน์และความสูงของแถว
    worksheet.getColumn('A').width = 51 / 6.5;
    worksheet.getColumn('B').width = 61 / 6.5;
    worksheet.getColumn('C').width = 51 / 6.5;
    worksheet.getColumn('D').width = 131 / 6.5;
    worksheet.getColumn('E').width = 131 / 6.5;
    worksheet.getColumn('F').width = 270 / 6.5;
    worksheet.getColumn('G').width = 161 / 6.5;
    worksheet.getColumn('H').width = 118 / 6.5;
    worksheet.getColumn('I').width = 195 / 6.5;
    worksheet.getColumn('J').width = 48 / 6.5;
    worksheet.getColumn('K').width = 48 / 6.5;

    worksheet.getRow(3).height = 37.2;
    worksheet.getRow(4).height = 32;
    worksheet.getRow(5).height = 24;
    worksheet.getRow(6).height = 24;
    worksheet.getRow(47).height = 50;
    worksheet.getRow(48).height = 40;

    console.log(`A1:K${totalRows + remainingRows}`)

    // กำหนดรูปแบบให้พอดีกับ A4
    // worksheet.pageSetup.paperSize = 9;  // A4
    // worksheet.pageSetup.fitToPage = true;
    // worksheet.pageSetup.fitToHeight = 1;
    // worksheet.pageSetup.fitToWidth = 1;
    // กำหนดรูปแบบการพิมพ์
    worksheet.pageSetup = {
        paperSize: 9,  // A4
        orientation: 'portrait',
        fitToPage: true,
        fitToHeight: 1,
        fitToWidth: 1,
        printArea: `A1:K48`,
        horizontalCentered: true,
        // verticalCentered: true,
        margins: {
            left: 0.3,
            right: 0.3,
            top: 0.3,
            bottom: 0.3,
            header: 0.3,
            footer: 0.3
        }
    };
};

const exportToExcel = async (data, nameCompany) => {
    const workbook = new ExcelJS.Workbook();
    const maxRowsPerSheet = 40;
    const totalSheets = Math.ceil(data.length / maxRowsPerSheet);

    for (let i = 0; i < totalSheets; i++) {
        const dataSubset = data.slice(i * maxRowsPerSheet, (i + 1) * maxRowsPerSheet);
        createWorksheet(workbook, dataSubset, i, totalSheets, nameCompany);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'FM-WH-05 รายงานรถเข้า-ออกจากโรงงาน-' + nameCompany + '.xlsx');
    // if (data === 9999) {

    // const workbook = new ExcelJS.Workbook();
    // createWorksheet(workbook, data);

    // const buffer = await workbook.xlsx.writeBuffer();
    // saveAs(new Blob([buffer]), 'report.xlsx');
    // // }
    // // const buffer = await workbook.xlsx.writeBuffer();
    // // saveAs(new Blob([buffer]), 'report.xlsx');
};

function TestCashInOut({ dataList, nameCompany, onFilter }) {
    return (
        <button onClick={() => exportToExcel(onFilter ? dataList.filter((x) => x.product_company_id === onFilter) : dataList, nameCompany)}>Export to Excel</button>
    );
}

export default TestCashInOut;