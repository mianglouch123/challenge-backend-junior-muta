CREATE TABLE IF NOT EXISTS public.materials
(
    id bigserial NOT NULL,
    name character varying(100) NOT NULL,
    weight numeric NOT NULL,
    value numeric NOT NULL,
    created_at time without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at time without time zone,
    CONSTRAINT materials_pkey PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS public.collections
(
    id bigserial NOT NULL ,
    id_material bigint NOT NULL,
    collection_date timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_at time without time zone,
    quantity integer NOT NULL DEFAULT 0,
    CONSTRAINT recolections_pkey PRIMARY KEY (id_material),
    CONSTRAINT fk_id_material FOREIGN KEY (id_material)
        REFERENCES public.materials (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);


CREATE TABLE IF NOT EXISTS public.users
(
    id bigserial NOT NULL,
    username character varying(20) NOT NULL,
    password character varying(60) NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_at timestamp without time zone,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);

