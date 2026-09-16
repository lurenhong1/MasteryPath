import type {ReactNode} from "react";

type ModalProps = {
    open: boolean;
    header: ReactNode;
    children: ReactNode;
    onClose: () => void;
};

function Modal({open, header, children, onClose}: ModalProps) {
    if (!open) {
        return null;
    }
    return (
        <div className="modal-backdrop">
            <section
                className="modal"
                role="dialog"
                aria-modal="true"
                aria-label="Answer feedback"
            >
                <div>
                    {header}
                    <button
                        type="button"
                        className="close-btn"
                        aria-label="Close"
                        onClick={onClose}
                    >
                        x
                    </button>
                </div>
                <div>
                    {children}
                </div>
            </section>
        </div>
    )
}

export default Modal;
