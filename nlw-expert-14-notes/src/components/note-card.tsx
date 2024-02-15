import * as Dialog from "@radix-ui/react-dialog"
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface NoteCardProps {
    noteCard: {
        id: string,
        dateOfCreation: Date,
        content: string
    },
    handleNoteDeleted: (id: string) => void;
}

export function NoteCard({noteCard, handleNoteDeleted}: NoteCardProps) {
    return (
        <Dialog.Root>
            <Dialog.Trigger className="rounded-md text-left bg-slate-800 p-5 space-y-3 overflow-hidden relative 
            hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none
            flex flex-col justify-start items-left">

                <span className="text-sm leading-6 text-slate-400">
                    {formatDistanceToNow(noteCard.dateOfCreation, {
                        locale: ptBR,
                        addSuffix: true,
                    })}
                </span>

                <p>
                    {noteCard.content}
                </p>

                <div className="absolute bottom-0 left-0 right-0 h-1/2 
                bg-gradient-to-t from-black/60 to-black/0 pointer-events-none" />

            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="inset-0 fixed bg-black/50"/>
                <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto 
                md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] 
                w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
                    <Dialog.Close className="absolute right-0 top-0 rounded-bl-md flex flex-col flex-center
                    bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
                        <span className="material-symbols-outlined">close</span>
                    </Dialog.Close>

                    <span className="text-sm leading-6 text-slate-400">
                    {formatDistanceToNow(noteCard.dateOfCreation, {
                        locale: ptBR,
                        addSuffix: true,
                    })}
                </span>

                <p>
                    {noteCard.content}
                </p>

                <button
                    type="button"
                    onClick={() => handleNoteDeleted(noteCard.id)}
                    className="w-full bg-slate-800 py-4 text-center text-sm text-slate-300 
                    outline-none font-medium group fixed bottom-0 left-0"
                    >
                    Deseja{" "}
                    <span className="text-red-400 group-hover:underline">
                    apagar essa nota
                    </span>
                    ?
                </button>

                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}